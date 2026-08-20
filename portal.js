const nextForm = document.querySelector('#innovationForm, #interestForm');
if (nextForm) {
  nextForm.addEventListener('submit', () => {
    const url = new URL(location.href);
    url.searchParams.set('submitted', '1');
    url.hash = '';
    nextForm.querySelector('[name="_next"]').value = url;
  });
}

const toast = document.querySelector('.toast');
if (toast && new URLSearchParams(location.search).get('submitted') === '1') {
  toast.hidden = false;
  history.replaceState({}, '', location.pathname);
}
if (toast) toast.querySelector('button').addEventListener('click', () => { toast.hidden = true; });

const cards = [...document.querySelectorAll('.stream-card')];
let chosen = cards[0];
cards.forEach(card => card.addEventListener('click', () => {
  chosen = card;
  cards.forEach(item => item.classList.toggle('selected', item === card));
  document.querySelector('#streamName').textContent = card.dataset.stream;
  document.querySelector('#streamDescription').textContent = card.dataset.description;
}));
const interest = document.querySelector('#interestDialog');
if (interest) {
  document.querySelector('#interestButton').addEventListener('click', () => {
    document.querySelector('#selectedStreamText').textContent = `You’re interested in: ${chosen.dataset.stream}`;
    document.querySelector('#streamInput').value = chosen.dataset.stream;
    interest.showModal();
  });
  interest.querySelector('.close').addEventListener('click', () => interest.close());
}

const authGate = document.querySelector('#authGate');
if (authGate) {
  authGate.style.cssText = 'position:fixed;inset:0;z-index:20;display:grid;place-items:center;padding:20px;background:#121722e8;backdrop-filter:blur(5px)';
  const authCard = authGate.querySelector('.auth-card');
  authCard.style.cssText = 'width:min(460px,100%);padding:36px;background:#f5f3ed;color:#121722;box-shadow:10px 10px 0 #caff69';
  authGate.querySelector('.auth-mark').style.cssText = 'font-size:34px;color:#5d7de0';
  const form = document.querySelector('#authForm');
  form.style.cssText = 'display:grid;gap:15px;margin-top:22px';
  form.querySelectorAll('input').forEach(input => { input.style.cssText = 'display:block;width:100%;margin-top:6px;padding:12px;border:1px solid #c3cbd0;background:#fff;font:14px Plus Jakarta Sans'; });
  const loginTitle = document.querySelector('#authTitle');
  loginTitle.style.cssText = 'font-size:42px;letter-spacing:-.08em;line-height:.95;margin:12px 0';
  const authCopy = document.querySelector('#authCopy');
  authCopy.style.color = '#627080';
  const error = document.querySelector('#authError');
  error.style.color = '#b42b27';
  const state = document.querySelector('#accountState');
  let loginMode = false;
  const name = document.querySelector('#authName');
  const nameLabel = document.querySelector('#authNameLabel');
  const email = document.querySelector('#authEmail');
  const password = document.querySelector('#authPassword');
  const submit = document.querySelector('#authSubmit');
  const switcher = document.querySelector('#authSwitch');
  const enter = user => {
    authGate.hidden = true;
    state.textContent = `Signed in: ${user.name}`;
    document.querySelector('[name="student_name"]').value = user.name;
    document.querySelector('[name="student_email"]').value = user.email;
    window.location.href = 'student-dashboard.html';
  };
  const renderAuth = () => {
    loginTitle.textContent = loginMode ? 'Welcome back.' : 'Create your account.';
    authCopy.textContent = loginMode ? 'Log in to submit your next innovation.' : 'Create a login to save and submit your innovation.';
    nameLabel.hidden = loginMode;
    name.required = !loginMode;
    password.autocomplete = loginMode ? 'current-password' : 'new-password';
    submit.innerHTML = loginMode ? 'Log in <span>→</span>' : 'Create account <span>→</span>';
    switcher.innerHTML = loginMode ? 'New to GenWorks? <button type="button">Create an account</button>' : 'Already have an account? <button type="button">Log in</button>';
    switcher.querySelector('button').addEventListener('click', () => { loginMode = !loginMode; error.hidden = true; renderAuth(); });
  };
  const saved = JSON.parse(localStorage.getItem('genworksStudent') || 'null');
  if (saved) enter(saved);
  renderAuth();
  form.addEventListener('submit', event => {
    event.preventDefault();
    const existing = JSON.parse(localStorage.getItem('genworksStudent') || 'null');
    if (loginMode) {
      if (!existing || existing.email !== email.value || existing.password !== password.value) {
        error.textContent = 'That email or password does not match this browser account.';
        error.hidden = false;
        return;
      }
      enter(existing);
      return;
    }
    const user = { name: name.value, email: email.value, password: password.value };
    localStorage.setItem('genworksStudent', JSON.stringify(user));
    enter(user);
  });
}

if (document.body.classList.contains('dashboard')) {
  const student = JSON.parse(localStorage.getItem('genworksStudent') || 'null');
  if (!student) window.location.href = 'student.html';
  else {
    document.querySelector('#studentName').textContent = student.name.split(' ')[0];
    document.querySelector('[name="student_name"]').value = student.name;
    document.querySelector('[name="student_email"]').value = student.email;
  }
  const innovationDialog = document.querySelector('#innovationDialog');
  document.querySelectorAll('[data-open-submit]').forEach(button => button.addEventListener('click', () => innovationDialog.showModal()));
  innovationDialog.querySelector('.close').addEventListener('click', () => innovationDialog.close());
  innovationDialog.addEventListener('click', event => { if (event.target === innovationDialog) innovationDialog.close(); });
}

const visualStyle = document.createElement('style');
visualStyle.textContent = `
  .portal-hero,.dash-hero{background-image:linear-gradient(90deg,#121722 15%,#121722bd 52%,#1217223d),url('https://www.tum.de/fileadmin/_processed_/4/1/csm_20250114_TUM_ChangeMakers-08491_LowRes_4b8d6ff0ca.jpg');background-position:center;background-size:cover}
  .dashboard .idea:nth-child(1){background-image:linear-gradient(0deg,#8cacfff2,#8cacff91),url('https://www.unsw.edu.au/content/dam/images/unsw-wide/innovation-hub/websites/2025-09-unsw-innovation-hub-website-images/Innovation%20Ecosystem%20Design%20Sprint193-square.jpg');background-size:cover;background-position:center}
  .dashboard .idea:nth-child(2){background-image:linear-gradient(0deg,#caff69ee,#caff698f),url('https://rca-media2.rca.ac.uk/images/RCA_030823_077.2e16d0ba.fill-829x585.jpg');background-size:cover;background-position:center}
  .dashboard .idea:nth-child(3){background-image:linear-gradient(0deg,#ff9179ee,#ff91798f),url('https://ed.buffalo.edu/content/dam/www/reporter/2020-photos/02/Global-innovation-challenge/Global-innovation-challenge-03.jpg');background-size:cover;background-position:center}
  .dashboard .idea:nth-child(4){background-image:linear-gradient(0deg,#c5a8ffee,#c5a8ff8f),url('https://ut-um.transforms.svdcdn.com/production/media/images/services/manage-more/services-manage-and-more-workshop.jpg?dm=1588231714&fit=crop&fm=webp&h=2169&q=90&s=b6600471f98af5bbbb2372a1bb0faf60&w=3840');background-size:cover;background-position:center}
`;document.head.appendChild(visualStyle);

if (document.body.classList.contains('dashboard')) {
  const projects = [...document.querySelectorAll('.idea')];
  const discussion = document.createElement('dialog');
  discussion.className = 'discussion-dialog';
  discussion.innerHTML = '<button class="close" aria-label="Close">×</button><p class="eyebrow">STUDENT DISCUSSION</p><h2></h2><div class="comment-list"></div><form><label>Add a thoughtful comment<textarea required placeholder="Share feedback, a question, or an idea..."></textarea></label><button type="submit">Post comment →</button></form>';
  document.body.appendChild(discussion);
  const discussionStyle = document.createElement('style');
  discussionStyle.textContent = '.idea .discuss{border:0;align-self:flex-start;margin-top:auto;background:#121722;color:white;padding:9px 11px;font:800 10px "Plus Jakarta Sans";cursor:pointer}.discussion-dialog{width:min(540px,calc(100% - 30px));border:0;padding:36px;background:#f5f3ed;color:#121722;box-shadow:10px 10px #caff69}.discussion-dialog::backdrop{background:#121722b8;backdrop-filter:blur(5px)}.discussion-dialog h2{font-size:38px;letter-spacing:-.07em;margin:12px 0}.comment-list{max-height:250px;overflow:auto;border-top:1px solid #c5ccd1;margin:18px 0}.comment{padding:14px 0;border-bottom:1px solid #c5ccd1}.comment b{font-size:12px}.comment p{font-size:13px;line-height:1.55;margin:5px 0 0;color:#536170}.discussion-dialog form{display:grid;gap:12px}.discussion-dialog textarea{height:86px}.discussion-dialog form button{justify-self:start;cursor:pointer;border:0;background:#121722;color:#fff;padding:12px 15px;font-weight:800}';
  document.head.appendChild(discussionStyle);
  let activeProject = '';
  const comments = () => JSON.parse(localStorage.getItem('genworksInnovationComments') || '{}');
  const renderComments = () => {
    const entries = comments()[activeProject] || [];
    const list = discussion.querySelector('.comment-list');
    list.replaceChildren();
    if (!entries.length) list.textContent = 'No comments yet. Be the first to encourage this idea.';
    entries.forEach(entry => { const comment = document.createElement('article'); comment.className = 'comment'; const author = document.createElement('b'); author.textContent = entry.author; const text = document.createElement('p'); text.textContent = entry.text; comment.append(author, text); list.appendChild(comment); });
  };
  projects.forEach((project, index) => {
    const button = document.createElement('button');
    button.className = 'discuss'; button.type = 'button'; button.textContent = 'View & comment  ↗'; project.appendChild(button);
    button.addEventListener('click', () => { activeProject = `project-${index}`; discussion.querySelector('h2').textContent = project.querySelector('h3').textContent; renderComments(); discussion.showModal(); });
  });
  discussion.querySelector('.close').addEventListener('click', () => discussion.close());
  discussion.addEventListener('click', event => { if (event.target === discussion) discussion.close(); });
  discussion.querySelector('form').addEventListener('submit', event => {
    event.preventDefault(); const input = discussion.querySelector('textarea'); const saved = comments(); const profile = JSON.parse(localStorage.getItem('genworksStudent') || '{}');
    saved[activeProject] = saved[activeProject] || []; saved[activeProject].push({ author: profile.name || 'GenWorks student', text: input.value.trim() });
    localStorage.setItem('genworksInnovationComments', JSON.stringify(saved)); input.value = ''; renderComments();
  });
}
