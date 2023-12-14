import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import toast from "react-hot-toast";

export function setCategory(
  {
    selectCategory,
    newCategoryBase
  }: {
    selectCategory: HTMLSelectElement | null,
    newCategoryBase: HTMLOptionElement | null
  }
) {
  if (!selectCategory || !newCategoryBase) return;
  if (selectCategory.value === "new") {
    const answer = prompt("新規カテゴリーを入力してください");
    if (answer === null || answer === "new") {
      selectCategory.value = selectCategory.dataset.before || "";
    } else if (answer && !selectCategory.querySelector(`[value="${answer}"]`)) {
      const newCategoryID = "newCategory";
      let newCategory = selectCategory.querySelector(
        `option#${newCategoryID}`
      ) as HTMLOptionElement;
      if (!newCategory) {
        newCategory = document.createElement("option");
        newCategory.id = newCategoryID;
        newCategoryBase.after(newCategory);
      }
      newCategory.value = answer;
      newCategory.innerText = answer;
      selectCategory.value = answer;
    } else {
      selectCategory.value = answer;
    }
  }
  selectCategory.dataset.before = selectCategory.value;
}
type textareaType = {
  textarea: HTMLTextAreaElement | null
}
export function replacePostTextarea({ textarea, before = '', after }: textareaType & { before: string, after?: string }) {
  if (!textarea) return;
  if (after === undefined) after = before;
  const { selectionStart, selectionEnd } = textarea;
  const selection = textarea.value.slice(selectionStart, selectionEnd);
  textarea.setRangeText(`${before}${selection}${after}`, selectionStart, selectionEnd);
  if (selectionStart === selectionEnd) {
    const selectionStartReset = selectionStart + before.length;
    textarea.setSelectionRange(selectionStartReset, selectionStartReset);
  }
  textarea.focus();
}

export function setDecoration(
  {
    selectDecoration,
    textarea,
    colorChanger
  }: textareaType & {
    selectDecoration: HTMLSelectElement | null,
    colorChanger: HTMLInputElement | null
  }
) {
  if (!selectDecoration || !textarea) return;
  switch (selectDecoration.value) {
    case 'color':
      if (colorChanger) colorChanger.click();
      break;
    case 'italic':
      replacePostTextarea({ textarea, before: '*' })
      break;
    case 'bold':
      replacePostTextarea({ textarea, before: '**' })
      break;
    case 'strikethrough':
      replacePostTextarea({ textarea, before: '~~' })
      break;
  }
  selectDecoration.value = '';
}

export function setColorChange(
  {
    textarea,
    colorChanger
  }: textareaType & {
    colorChanger: HTMLInputElement | null
  }
) {
  if (colorChanger && textarea) replacePostTextarea({ textarea, before: `<span style="color:${colorChanger.value}">`, after: '</span>' })
}

export function setPostInsert(
  {
    selectInsert,
    textarea,
  }: textareaType & {
    selectInsert: HTMLSelectElement | null,
  }
) {
  if (!selectInsert || !textarea) return;
  switch (selectInsert.value) {
    case 'br':
      replacePostTextarea({ textarea, before: "\n<br/>\n\n", after: "" })
      break;
    case 'more':
      replacePostTextarea({ textarea, before: "\n<details>\n<summary>もっと読む</summary>\n\n", after: "\n</details>" })
      break;
    case 'h2':
      replacePostTextarea({ textarea, before: '## ', after: '' })
      break;
    case 'h3':
      replacePostTextarea({ textarea, before: '### ', after: '' })
      break;
    case 'h4':
      replacePostTextarea({ textarea, before: '#### ', after: '' })
      break;
    case 'li':
      replacePostTextarea({ textarea, before: '- ', after: '' })
      break;
    case 'ol':
      replacePostTextarea({ textarea, before: '+ ', after: '' })
      break;
    case 'code':
      replacePostTextarea({ textarea, before: "```\n", after: "\n```" })
      break;
  }
  selectInsert.value = '';
}

export function setAttached({ inputAttached, textarea }: textareaType & { inputAttached: HTMLInputElement | null, textarea: HTMLTextAreaElement | null }) {
  if (!inputAttached || !textarea) return;
  const files = inputAttached.files || [];
  Array.from(files).forEach((file) => {
    const filename = file.name;
    const uploadname = filename.replaceAll(' ', '_');
    if (!textarea.value.match(uploadname)) {
      const value = `\n![${filename.replace(/\.[^.]+$/, '')}](/_media/images/blog/uploads/${uploadname})`;
      textarea.setRangeText(value);
      textarea.focus();
    }
  })
  inputAttached.style.display = (files.length === 0) ? 'none' : '';
}

export function setMedia(
  {
    selectMedia,
    inputAttached,
    textarea,
  }: textareaType & {
    selectMedia: HTMLSelectElement | null,
    inputAttached: HTMLInputElement | null,
  }
) {
  if (!selectMedia || !textarea) return;
  switch (selectMedia.value) {
    case 'attached':
      if (inputAttached) {
        if (inputAttached.style.display === 'none') inputAttached.value = '';
        inputAttached.click();
      }
      break;
    case 'gallery':
      // ここはモーダルモードでもよきかも
      window.open('/gallery/', 'gallery');
      break;
    case 'link':
      replacePostTextarea({ textarea, before: '[', after: ']()' })
      break;
  }
  selectMedia.value = '';
}

export function setOperation({
  selectOperation,
  postIdInput,
  router,
}: {
  selectOperation: HTMLSelectElement | null,
  postIdInput: HTMLInputElement | null,
  router?: AppRouterInstance,
}
) {
  if (!selectOperation || !postIdInput) return;
  switch (selectOperation.value) {
    case 'postid':
      const answer = prompt("記事のID名の変更", postIdInput.value);
      if (answer !== null) {
        postIdInput.value = answer;
      }
      break;
    case 'duplication':
      if (router) {
        if (confirm("記事を複製しますか？")) {
          router.replace(location.pathname + location.search.replace("target=", "base="));
        }
      }
      break;
    case 'delete':
      if (/target=/.test(location.search) && confirm("本当に削除しますか？")) {
        fetch("/blog/post/send", { method: "DELETE", body: JSON.stringify({ postId: postIdInput.value }) })
          .then((r) => r.json())
          .then((r) => {
            toast("削除しました", { duration: 2000 });
            if (router) { router.push("/blog"); router.refresh(); } else { location.href = "/blog" }
          })
      }
      break;
  }
  selectOperation.value = '';
}
