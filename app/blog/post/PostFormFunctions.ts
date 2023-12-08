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

export function replacePostTextarea({ textarea, before = '', after }: { textarea: HTMLTextAreaElement, before: string, after?: string }) {
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
    textarea
  }: {
    selectDecoration: HTMLSelectElement | null,
    textarea: HTMLTextAreaElement | null
  }
) {
  if (!selectDecoration || !textarea) return;
  switch (selectDecoration.value) {
    case 'color':
      // const colorChanger = document.getElementById("colorChanger");
      // if (colorChanger) colorChanger.click();
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

// export function post_insert(select) {
//   switch (select.value) {
//     case 'br':
//       post_replaceBody(select.form.body, "\n<br/>\n\n", "")
//       break;
//     case 'more':
//       post_replaceBody(select.form.body, "\n<details>\n<summary>もっと読む</summary>\n\n", "\n</details>")
//       break;
//     case 'h2':
//       post_replaceBody(select.form.body, '## ', '')
//       break;
//     case 'h3':
//       post_replaceBody(select.form.body, '### ', '')
//       break;
//     case 'h4':
//       post_replaceBody(select.form.body, '#### ', '')
//       break;
//     case 'li':
//       post_replaceBody(select.form.body, '- ', '')
//       break;
//     case 'ol':
//       post_replaceBody(select.form.body, '+ ', '')
//       break;
//     case 'code':
//       post_replaceBody(select.form.body, "```\n", "\n```")
//       break;
//   }
//   select.value = '';
// }

// export function post_colorChange(colorChanger) {
//   post_replaceBody(colorChanger.form.body, `<span style="color:${colorChanger.value}">`, '</span>')
// }

// export function moreRead_switch(detail) {
//   const beforeScrollY = window.scrollY;
//   const detailHeight = detail.scrollHeight;
//   let opened = true;
//   if (detail.tagName === 'DETAILS') {
//     opened = detail.toggleAttribute('open');
//   } else {
//     opened = detail.parentElement.classList.toggle('moreOpen');
//   }
//   const afterScrollY = window.scrollY;
//   if (!opened && detail.offsetTop < afterScrollY) {
//     window.scrollBy({top: (beforeScrollY - afterScrollY) - detailHeight + detail.scrollHeight});
//   }
//   innerLoad.history.setCurrent();
//   return false;
// }

// export function post_attached(input) {
//   const body = input.form.body;
//   Array.from(input.files).forEach((file) => {
//     const filename = file.name;
//     const uploadname = filename.replaceAll(' ', '_');
//     if (!body.value.match(uploadname)) {
//       body.value = `${body.value}\n![${filename.replace(/\.[^.]+$/, '')}](/images/blog/uploads/${uploadname})`
//     }
//   })
//   input.style.display = (input.files.length === 0) ? 'none' : '';
// }

// export function post_media(select) {
//   switch (select.value) {
//     case 'attached':
//       const attached = select.form.querySelector('input[name^="attach"]');
//       if (attached.style.display === 'none') attached.value = '';
//       attached.click();
//       break;
//     case 'gallery':
//       window.open('/gallery/', 'gallery');
//       break;
//     case 'link':
//       post_replaceBody(select.form.body, '[', ']()')
//       break;
//   }
//   select.value = '';
// }

// export function post_operation(select) {
//   switch (select.value) {
//     case 'postid':
//       const answer = prompt("記事のID名の変更", select.form.postId.value);
//       if (answer !== null) {
//         select.form.postId.value = answer;
//       }
//       break;
//     case 'duplication':
//       if (confirm("記事を複製しますか？")) {
//         select.form.update.value = '';
//         select.form.postId.value = '';
//         select.form.querySelector('[type="submit"]').value = '投稿する';
//         history.replaceState(0, null, './');
//       }
//       break;
//     case 'delete':
//       const form = select.form;
//       if (form.update.value && confirm("本当に削除しますか？")) {
//         const deleteForm = document.createElement('form');
//         deleteForm.style.display = 'none';
//         deleteForm.method = 'POST';
//         deleteForm.action = '/blog/';
//         const deleteIdElm = document.createElement('input');
//         deleteIdElm.name = 'postId';
//         deleteIdElm.value = form.update.value;
//         deleteForm.append(deleteIdElm);
//         const deleteProcessElm = document.createElement('input');
//         deleteProcessElm.name = 'process';
//         deleteProcessElm.value = 'delete';
//         deleteForm.append(deleteProcessElm);
//         document.body.append(deleteForm);
//         deleteForm.submit();
//       }
//       break;
//   }
//   select.value = '';
// }
