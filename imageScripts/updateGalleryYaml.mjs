// @ts-check
/**
 */
import { parse, stringify } from "yaml";
import { Dirent, mkdirSync, readFileSync, readdirSync, renameSync, statSync, unlinkSync, writeFileSync } from "fs";

const imageGroups = [
  "art",
  "goods",
  "fanart",
  "given",
  "works",
  "picture",
];

// 管理データ周りの読込
const manageFilePath = "./updateGallery.json";
let manageData = null;
try {
  manageData = JSON.parse(String(readFileSync(manageFilePath)));
} catch (e) {
  manageData = new Object();
}
let manageFileUpdated = false;  // 管理データが更新されたか

// yamlマップデータ用のインターフェース
/**
 * @typedef { import("./galleryYamlType.d.ts").YamlList } YamlList
 * @typedef { import("./galleryYamlType.d.ts").YamlData } YamlData
 * @typedef { import("./galleryYamlType.d.ts").YamlObject } YamlObject
 */
// 各ディレクトリの定義と生成
const mediaDir = `../public/_media`;  // このディレクトリが基準になる
const archiveDirName = '.archive';
const imageDir = `images`;
const imageYamlDir = `../_data/image/gallery`;
try { mkdirSync(imageYamlDir); } catch { }
/** @type Map<string, YamlObject> */
const imageYamlData = new Map();
const imageYamlArchiveDir = `${imageYamlDir}/${archiveDirName}`;
try { mkdirSync(imageYamlArchiveDir); } catch { }
/** @type Map<string, YamlObject> */
const imageYamlArchiveData = new Map();
// グループごとのマッピングデータに管理ファイルの情報を加える
imageGroups.forEach((group) => {
  let path = "";
  let readStr = "";
  let data = null;
  let mtime = 0;
  try {
    path = `${imageYamlDir}/${group}.yaml`;
    readStr = String(readFileSync(path));
    data = parse(readStr);
    mtime = Number(statSync(path).mtime?.getTime());
  } catch (e) {
    data = { title: group, name: group, dir: `${imageDir}/${group}`, description: "" };
  }
  if (!data.list) data.list = [];
  data.list.forEach(
    /** @param { YamlList } item */
    (item) => item.dir = item.dir || '');
  imageYamlData.set(group, { path, data, mtime });
  if (!manageData[group]) manageData[group] = {};
  try {
    path = `${imageYamlArchiveDir}/${group}.yaml`;
    readStr = String(readFileSync(path));
    data = parse(readStr);
    mtime = Number(statSync(path).mtime?.getTime());
  } catch (e) {
    data = { title: `${group}'s archive` };
    mtime = 0;
  }
  if (!manageData[group].archive) manageData[group].archive = {};
  if (!data.list) data.list = [];
  data.list.forEach(
    /** @param { YamlList } item */
    (item) => item.dir = item.dir || '');
  imageYamlArchiveData.set(group, { path, data, mtime });
});

/**
 * @typedef { import("./galleryYamlType.d.ts").PlusDirEntry } PlusDirEntry
 * @commment ディレクトリ一覧の出力
 * @param {string} cur
 * @return PlusDirEntry[]
 */
function outReadDirList(cur) {
  let list = [];
  try {
    const mediaCur = `${mediaDir}/${cur}`;
    const readDir = Array.from(readdirSync(mediaCur, { withFileTypes: true }));
    if (readDir.length > 0) {
      Array.from(readDir).forEach((item) => {
        const curPath = `${cur}/${item.name}`;
        const staticCurPath = `${mediaDir}/${curPath}`;
        if (item.isFile()) {
          const stat = statSync(staticCurPath);
          list.push({
            ...item,
            ...{ dir: cur, mtime: new Date((stat.mtime || "")) },
          });
        } else if (item.isDirectory()) {
          if (!/^[._]/.test(item.name)) {
            list = [...list, ...outReadDirList(curPath)];
          }
        }
      });
    } else {
      unlinkSync(mediaCur);
    }
  } catch { }
  return list;
}

// 課題：管理ファイルが更新されていれば、その通りに移動させたい（DDが面倒なので）
// どっちも同じファイル名があればアーカイブじゃないところを基準にする

// 処理部、ここでファイルを引っ越しさせたりする
imageGroups.forEach((group) => {
  const yamlData = imageYamlData.get(group);  // yamlのデータ
  if (!yamlData) return;
  const data = yamlData.data;
  // const preListLength = data.list.length;
  const newList = [];
  const archiveYamlData = imageYamlArchiveData.get(group);
  if (!archiveYamlData) return;
  const archiveData = archiveYamlData.data;
  const preArchiveListLength = archiveData.list.length;
  // ここで管理ファイルの更新日がupdateGalleryよりも新しければ更新する
  const yamlUpdated = (yamlData.mtime || 0) !== manageData[group].mtime;
  const archiveYamlUpdated = (archiveYamlData.mtime || 0) !== manageData[group].archive.mtime;
  let updated = yamlUpdated;
  let updatedArchive = archiveYamlUpdated;
  // ここで読み込んだファイルのリストを取得
  const dirPath = data.path || `${imageDir}/${group}`;
  const readDirList = outReadDirList(dirPath);
  // データの確認用などでアーカイブも取得
  const dirArchivePath = `${dirPath}/${archiveDirName}`;
  const readArchiveDirList = outReadDirList(dirArchivePath);
  // yaml更新されていて、readDirListにないデータがyamlにある場合はアーカイブがあれば取得する
  if (yamlUpdated) {
    // 更新されているyamlの項目を取得
    yamlData.data.list.filter((item, i) => {
      return !readDirList.some(file => (file.name === item.src && file.dir === `${dirPath}${item.dir}`));
    }).forEach(item => {
      let fromFile = readDirList.find(file => file.name === item.src);
      const existFromFile1 = Boolean(fromFile);
      let existFromFile2 = false;
      if (!existFromFile1) {
        fromFile = readArchiveDirList.find(file => file.name === item.src);
        existFromFile2 = Boolean(fromFile);
      }
      if (fromFile) {
        const renameFrom = `${mediaDir}${fromFile.dir}/${fromFile.name}`;
        const renameToDir = `${mediaDir}${dirPath}${item.dir}`
        const renameTo = `${renameToDir}/${item.src}`;
        try { mkdirSync(renameToDir) } catch { };
        try { renameSync(renameFrom, renameTo) } catch { }
        if (existFromFile1) {
          const index = readDirList.findIndex(file => file.name === fromFile.name);
          readDirList[index].dir = `${dirPath}${item.dir}`;
        } else if (existFromFile2) {
          const index = readArchiveDirList.findIndex(file => file.name === fromFile.name);
          const item2 = readArchiveDirList.splice(index, 1).pop();
          if (item2) {
            item2.dir = `${dirPath}${item.dir}`;
            readDirList.push(item2);
          }
          const indexArchiveYamlData = archiveYamlData.data.list.findIndex(file => file.src === fromFile.name);
          archiveYamlData.data.list.splice(indexArchiveYamlData, 1)
        }
      }
    })
  }
  // アーカイブも似たようなループをする
  if (archiveYamlUpdated) {
    archiveYamlData.data.list.filter((item, i) => {
      return !readArchiveDirList.some(file => (file.name === item.src && file.dir === `${dirArchivePath}${item.dir}`));
    }).forEach(item => {
      let fromFile = readDirList.find(file => file.name === item.src);
      const existFromFile1 = Boolean(fromFile);
      let existFromFile2 = false;
      if (!existFromFile1) {
        fromFile = readArchiveDirList.find(file => file.name === item.src);
        existFromFile2 = Boolean(fromFile);
      }
      if (fromFile) {
        const renameFrom = `${mediaDir}${fromFile.dir}/${fromFile.name}`;
        const renameToDir = `${mediaDir}${dirArchivePath}${item.dir}`
        const renameTo = `${renameToDir}/${item.src}`;
        try { mkdirSync(renameToDir) } catch { };
        try { renameSync(renameFrom, renameTo) } catch { }
        if (existFromFile1) {
          const index = readDirList.findIndex(file => file.name === fromFile.name);
          const item1 = readDirList.splice(index, 1).pop();
          if (item1) {
            item1.dir = `${dirArchivePath}${item.dir}`;
            readArchiveDirList.push(item1);
          }
        } else if (existFromFile2) {
          const index = readArchiveDirList.findIndex(file => file.name === fromFile.name);
          readArchiveDirList[index].dir = `${dirArchivePath}${item.dir}`;
        }
      }
    })
  }
  readDirList.forEach(
    /** @param {PlusDirEntry} item */
    (item) => {
      const listFindIndex = data.list.findIndex((e) => e.src == item.name);
      const archiveListFindIndex = archiveData.list.findIndex((e) =>
        e.src == item.name
      );
      const dir = item.dir.replace(dirPath, "");
      if (listFindIndex < 0 && archiveListFindIndex < 0) {
        const insertData = {
          src: item.name,
          time: item.mtime.toLocaleString("sv-SE", { timeZone: "JST" }) + "+09:00",
          dir,
          mtime: item.mtime,
          title: item.name.replace(/.[^.]+$/, ""),
          description: "",
          tags: [group],
        };
        newList.push(insertData);
        updated = true;
      } else {
        if (listFindIndex >= 0) {
          const listFind = data.list.splice(listFindIndex, 1)[0];
          if (!updated) updated = (listFind.dir || "") !== dir;
          newList.push({ ...listFind, ...{ dir } });
        } else {
          const listFind = archiveData.list.splice(archiveListFindIndex, 1)[0];
          newList.push({ ...listFind, ...{ dir } });
          updated = true;
          updatedArchive = true;
        }
      }
    });
  if (!updated && (data.list.length > 0)) updated = true;
  // 使われなかったものをアーカイブしつつ、重複削除する
  const acvList = [...archiveData.list, ...data.list];
  acvList.forEach((item, i) => {
    item.index = acvList.findIndex((e) => e.src === item.src);
    if (item.index !== i) {
      acvList[item.index].tags = [...item.tags, ...acvList[item.index].tags]
      acvList[item.index] = { ...item, ...acvList[item.index] }
    }
  });
  archiveData.list = acvList.filter((item, i) => item.index === i);
  archiveData.list.forEach(item => { delete item.index; })
  if (!updatedArchive && (archiveData.list.length !== preArchiveListLength)) {
    updatedArchive = true;
  }
  if (updated) {
    data.list = newList
      .sort((a, b) => (a.time < b.time ? 1 : -1))
      .map((item) => {
        delete item.mtime;
        delete item.exist;
        if (item.dir === "") delete item.dir;
        return item;
      });
    writeFileSync(yamlData.path, stringify(data));
    manageData[group].mtime = Number(
      statSync(yamlData.path).mtime?.getTime(),
    );
  }
  if (updatedArchive) {
    archiveData.list = archiveData.list
      .sort((a, b) => (a.time < b.time ? 1 : -1))
      .map((item) => {
        delete item.mtime;
        delete item.exist;
        if (item.dir === "") delete item.dir;
        return item;
      });
    writeFileSync(archiveYamlData.path, stringify(archiveData));
    try {
      const archiveStat = statSync(archiveYamlData.path);
      manageData[group].archive.mtime = Number(archiveStat.mtime?.getTime());
    } catch {
      manageData[group].archive.mtime = 0;
    }
  }
  if (updated || updatedArchive) {
    manageFileUpdated = true;
    console.log(`${group}.yaml updated!`);
  }
});
if (manageFileUpdated) {
  writeFileSync(manageFilePath, JSON.stringify(manageData));
} else {
  console.log("Yamlファイルの更新はありませんでした。");
}
