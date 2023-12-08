document.addEventListener("keydown", (e) => {
  const editable = (e.target.editable || e.target.tagName.match(/^(TEXTAREA|INPUT)$/))
  if ($COOKIE['login']) {
    switch (e.code) {
      case "Enter":
        if (editable && e.ctrlKey) {
          if (!Boolean(e.target.form.onsubmit) || e.target.form.onsubmit()) e.target.form.submit()
        }
        break;
      case "Period":
        if (e.ctrlKey) {
          if (document.forms[0]) post_preview(document.forms[0]);
        }
        break;
      case "KeyC":
      case "KeyN":
        if (!editable && !e.ctrlKey) {
          const body = document.querySelector(`form textarea[name="body"]`);
          if (body) {
            body.focus();
          } else {
            innerLoad.pageUpdate("/blog/post/");
          }
          e.preventDefault()
        }
        break;
    }
  }
  switch (e.code) {
    case "Escape":
      document.activeElement.blur();
    case "Slash":
      if (!editable && !e.ctrlKey) {
        document.querySelector(`form input[name="q"]`).focus();
        e.preventDefault()
      }
      break;
  }
});
function posts_search(form) {
  document.activeElement.blur();
  const search_q = form.q.value.replace('#', '%23');
  const url = search_q ? `?q=${search_q}` : location.pathname;
  innerLoad.pageUpdate(url);
  return false;
}
function posts_search_update(content) {
  const elem_q = content.querySelector(`input[name="q"]`);
  if (elem_q) {
    elem_q.value = $GET.q || '';
  }
}
function moreRead_switch(detail) {
  const beforeScrollY = window.scrollY;
  const detailHeight = detail.scrollHeight;
  let opened = true;
  if (detail.tagName === 'DETAILS') {
    opened = detail.toggleAttribute('open');
  } else {
    opened = detail.parentElement.classList.toggle('moreOpen');
  }
  const afterScrollY = window.scrollY;
  if (!opened && detail.offsetTop < afterScrollY) {
    window.scrollBy({top: (beforeScrollY - afterScrollY) - detailHeight + detail.scrollHeight});
  }
  innerLoad.history.setCurrent();
  return false;
}
function post_preview(form) {
  const preview_elm = form.querySelector("#preview_area");
  const body_elm = form.body;
  form.classList.toggle('preview');
  if (form.classList.contains('preview')) {
    let body_str = marked.parse(body_elm.value);
    body_str = body_str.replace(/<\!--\s+more\s+([^\s\-]*)\s*-->\s*([\s\S]+)$/, (m, m1, m2) => {
      const moreRead = m1 || "もっと読む";
      let more = `<button class="moreReadButton" title="もっと読む" onclick="return moreRead_switch(this)">${moreRead}</button>`;
      more = `<div class="moreReadArea">${more}<div class="moreRead">${m2}<button class="moreReadClose" title="折りたたむ" onclick="return moreRead_switch(this.parentElement)">閉じる</button></div></div>`;
      return more;
    });
    preview_elm.innerHTML = twemoji.parse(body_str);
  }
}
function post_replaceBody(body, before = '', after = null) {
  if (after === null) after = before;
  const { selectionStart, selectionEnd } = body;
  const selection = body.value.substr(selectionStart, selectionEnd - selectionStart);
  body.setRangeText(`${before}${selection}${after}`, selectionStart, selectionEnd);
  if (selectionStart === selectionEnd) {
    const selectionStartReset = selectionStart + before.length;
    body.setSelectionRange(selectionStartReset, selectionStartReset);
  }
  body.focus();
}
function post_colorChange(colorChanger) {
  post_replaceBody(colorChanger.form.body, `<span style="color:${colorChanger.value}">`, '</span>')
}

function post_category(select) {
  if (select.value === 'new') {
    answer = prompt('新規カテゴリーを入力してください');
    if (answer === null || answer === 'new') {
      select.value = select.dataset.before;
    } else if (answer && !select.querySelector(`[value="${answer}"]`)) {
      const newCategoryID = 'newCategory';
      const baseElm = select.querySelector(`[value="new"]`);
      let newCategory = select.querySelector(`#${newCategoryID}`);
      if (!newCategory) {
        newCategory = document.createElement('option');
        newCategory.id = newCategoryID;
        baseElm.after(newCategory);
      }
      newCategory.value = answer;
      newCategory.innerText = answer;
      select.value = answer;
    } else {
      select.value = answer;
    }
  } else {

  }
  select.dataset.before = select.value;
}

function post_attached(input) {
  const body = input.form.body;
  Array.from(input.files).forEach((file) => {
    const filename = file.name;
    const uploadname = filename.replaceAll(' ', '_');
    if (!body.value.match(uploadname)) {
      body.value = `${body.value}\n![${filename.replace(/\.[^.]+$/, '')}](/images/blog/uploads/${uploadname})`
    }
  })
  input.style.display = (input.files.length === 0) ? 'none' : '';
}

function post_media(select) {
  switch (select.value) {
    case 'attached':
      const attached = select.form.querySelector('input[name^="attach"]');
      if (attached.style.display === 'none') attached.value = '';
      attached.click();
      break;
    case 'gallery':
      window.open('/gallery/', 'gallery');
      break;
    case 'link':
      post_replaceBody(select.form.body, '[', ']()')
      break;
  }
  select.value = '';
}

function post_decoration(select) {
  switch (select.value) {
    case 'color':
      const colorChanger = document.getElementById("colorChanger");
      if (colorChanger) colorChanger.click();
      break;
    case 'italic':
      post_replaceBody(select.form.body, '*')
      break;
    case 'bold':
      post_replaceBody(select.form.body, '**')
      break;
    case 'strikethrough':
      post_replaceBody(select.form.body, '~~')
      break;
  }
  select.value = '';
}
function post_insert(select) {
  switch (select.value) {
    case 'br':
      post_replaceBody(select.form.body, "\n<br/>\n\n", "")
      break;
    case 'more':
      post_replaceBody(select.form.body, "\n<details>\n<summary>もっと読む</summary>\n\n", "\n</details>")
      break;
    case 'h2':
      post_replaceBody(select.form.body, '## ', '')
      break;
    case 'h3':
      post_replaceBody(select.form.body, '### ', '')
      break;
    case 'h4':
      post_replaceBody(select.form.body, '#### ', '')
      break;
    case 'li':
      post_replaceBody(select.form.body, '- ', '')
      break;
    case 'ol':
      post_replaceBody(select.form.body, '+ ', '')
      break;
    case 'code':
      post_replaceBody(select.form.body, "```\n", "\n```")
      break;
  }
  select.value = '';
}

function post_operation(select) {
  switch (select.value) {
    case 'postid':
      const answer = prompt("記事のID名の変更", select.form.postId.value);
      if (answer !== null) {
        select.form.postId.value = answer;
      }
      break;
    case 'duplication':
      if (confirm("記事を複製しますか？")) {
        select.form.update.value = '';
        select.form.postId.value = '';
        select.form.querySelector('[type="submit"]').value = '投稿する';
        history.replaceState(0, null, './');
      }
      break;
    case 'delete':
      const form = select.form;
      if (form.update.value && confirm("本当に削除しますか？")) {
        const deleteForm = document.createElement('form');
        deleteForm.style.display = 'none';
        deleteForm.method = 'POST';
        deleteForm.action = '/blog/';
        const deleteIdElm = document.createElement('input');
        deleteIdElm.name = 'postId';
        deleteIdElm.value = form.update.value;
        deleteForm.append(deleteIdElm);
        const deleteProcessElm = document.createElement('input');
        deleteProcessElm.name = 'process';
        deleteProcessElm.value = 'delete';
        deleteForm.append(deleteProcessElm);
        document.body.append(deleteForm);
        deleteForm.submit();
      }
      break;
  }
  select.value = '';
}

const posts = () => {}
export default posts;