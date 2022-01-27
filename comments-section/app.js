// Seletores
const container = document.querySelector('#all-comments');
const currentUserImage = document.querySelector('.current-user-image');
const submitComment = document.querySelector('.form');
const userInput = document.querySelector('#comment');
const btnCancel = document.querySelector('.btn--cancel');
const btnDel = document.querySelector('.btn--del');
const modal = document.querySelector('.modal');

// Carregar JSON
const loadJsonFile = async () => {
  const res = await fetch('./data.json');
  return (data = await res.json());
};

// HTML
const userComment = (el, currentUser, reply = false, commentData) => {
  const username = el.user?.username ?? el.username;

  return `
<div class="card ${reply ? 'reply-card' : ''}">
    <div class="card__widget">
      <span class="card__widget--sign">&plus;</span>
      <span class="card__widget--number">${
        el.score ?? commentData.userScore
      }</span>
      <span class="card__widget--sign">&minus;</span>
    </div>

    <div class="card__content">
      <div class="user-data">
        <span
          ><img
            src="${el.user?.image.png ?? el.image.png}"
            alt="avatar"
            class="avatar-image"
        /></span>
        <span class="username">${username}</span>
        <span class="post-date">${el.createdAt ?? commentData.postData}</span>
      </div>

      <p class="paragraph">
        ${
          reply
            ? `<span class="reply-to">@${
                el.replyingTo ?? commentData.personToReply
              }</span>`
            : ''
        }
        ${el.content ?? commentData.userCommentValue}
      </p>

      ${
        username === currentUser
          ? `
      <div class="reply">
            <div class="btn-del">
              <svg
                width="12px"
                height="14px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z"
                  fill="#ED6368"
                />
              </svg>
              <span class="reply__text reply__text--del">Delete</span>
            </div>

            <div class="btn-edit">
              <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z"
                  fill="#5357B6"
                />
              </svg>
              <span class="reply__text reply__text--edit">Edit</span>
            </div>
          </div>
      `
          : `
      <div class="reply btn-reply">
      <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z"
          fill="#5357B6"
        />
      </svg>
      <span class="reply__text reply__text--reply">Reply</span>
    </div>
      `
      }

    </div>
  </div>
`;
};

const userReply = async (reply = false) => {
  const data = await loadJsonFile();
  return `
  <div class="card comment-card ${reply ? 'reply-card' : ''}">
      <img
        src="${data.currentUser.image.png}"
        alt="current user"
        class="avatar-image current-user-image"
      />
      <form action="#" class="form">
        <textarea
          name="comment"
          id="comment"
          class="add-comment"
          placeholder="Add a comment..."
          rows="4"
        ></textarea>
        <button class="btn btn--primary btn--edit">reply</button>
      </form>
    </div>
  `;
};

const userEditComment = (placeholder) => {
  return `
  <form action="#" class="form__edit">
        <textarea
          name="comment"
          id="comment"
          class="add-comment__edit"
          rows="4"
        >${placeholder}</textarea>
        <button class="btn btn--primary btn--update">update</button>
      </form>
  `;
};

// Listar comentários
const loadDummyData = async () => {
  const data = await loadJsonFile();
  const currentUser = data.currentUser.username;

  data.comments.forEach((el) => {
    container.insertAdjacentHTML('beforeend', userComment(el, currentUser));

    if (el.replies.length > 0) {
      el.replies.forEach((el) => {
        container.insertAdjacentHTML(
          'beforeend',
          userComment(el, currentUser, (reply = true))
        );
      });
    }
  });
};

loadDummyData();

// Carregar informações do usuário atual
const loadUserData = async () => {
  const data = await loadJsonFile();

  currentUserImage.src = data.currentUser.image.png;
};

loadUserData();

// Adicionar comentário
submitComment.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = await loadJsonFile();

  const currentUser = data.currentUser.username;
  const el = data.currentUser;

  const commentData = {
    postData: Intl.DateTimeFormat('pt-br').format(new Date()),
    userCommentValue: userInput.value,
    userScore: Math.floor(Math.random() * 10 + 1),
  };

  userInput.value = '';

  container.insertAdjacentHTML(
    'afterbegin',
    userComment(el, currentUser, (reply = false), commentData)
  );

  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Remover comentario
container.addEventListener('click', (e) => {
  if (!e.target.classList.contains('reply__text--del')) return;
  const btnDel = e.target;
  modal.classList.remove('hidden');

  modalOptions(btnDel);
});

const modalOptions = (target) => {
  btnCancel.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('hidden');
  });

  btnDel.addEventListener('click', (e) => {
    e.preventDefault();
    target.parentElement.parentElement.parentElement.parentElement.remove();
    modal.classList.add('hidden');
  });
};

let isEnable = true;
let cardToReply;
let personToReply;

// Reply
container.addEventListener('click', (e) => {
  if (!isEnable || !e.target.classList.contains('reply__text--reply')) return;

  cardToReply = e.target.closest('.card');
  personToReply =
    e.target.parentElement.parentElement.querySelector('.username').innerText;

  toReply(cardToReply);
});

const addCommentArea = async (bol, target) => {
  target.insertAdjacentHTML('afterend', await userReply((reply = bol)));
  const textarea = target.nextSibling.nextSibling.querySelector('#comment');
  textarea.focus();
  isEnable = false;
};

const toReply = async (target) => {
  if (isEnable && !target.classList.contains('reply-card')) {
    addCommentArea(false, target);
  }

  if (isEnable && target.classList.contains('reply-card')) {
    addCommentArea(true, target);
  }
};

container.addEventListener('click', (e) => {
  if (!e.target.classList.contains('btn--edit')) return;
  e.preventDefault();
  const btnSend = e.target;
  const textarea = e.target.parentElement.querySelector('#comment');

  if (!textarea.value) return;
  sendReply(btnSend, textarea);
});

const sendReply = async (target, textarea) => {
  const data = await loadJsonFile();

  const currentUser = data.currentUser.username;
  const el = data.currentUser;

  const commentData = {
    postData: Intl.DateTimeFormat('pt-br').format(new Date()),
    userCommentValue: textarea.value,
    userScore: Math.floor(Math.random() * 10 + 1),
    personToReply,
  };

  target.parentElement.parentElement.remove();

  isEnable = true;

  cardToReply.insertAdjacentHTML(
    'afterend',
    userComment(el, currentUser, (reply = true), commentData)
  );
};

// Edit comment
container.addEventListener('click', (e) => {
  if (!e.target.classList.contains('reply__text--edit')) return;
  const cardContent = e.target.closest('.card__content');
  const userTextEl = cardContent.querySelector('.paragraph');
  const userText = cardContent.querySelector('.paragraph').innerText;

  userTextEl.remove();
  cardContent.insertAdjacentHTML('beforeend', userEditComment(userText));

  updateComment(cardContent);
});

const updateComment = (cardContent) => {
  container.addEventListener('click', (e) => {
    if (!e.target.classList.contains('btn--update')) return;
    e.preventDefault();

    const textareaVal = cardContent.querySelector('#comment').value;

    cardContent.insertAdjacentHTML(
      'beforeend',
      `
    <p class="paragraph">${textareaVal}</p>
    `
    );

    cardContent.querySelector('.form__edit').remove();
  });
};
