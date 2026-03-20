import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAzn2X18AOgN59nc1O_RnHT2AJDRINYu7M",
    authDomain: "sayhiwithme-0000002.firebaseapp.com",
    databaseURL: "https://sayhiwithme-0000002-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "sayhiwithme-0000002",
    storageBucket: "sayhiwithme-0000002.firebasestorage.app",
    messagingSenderId: "330846125548",
    appId: "1:330846125548:web:f308385a1aa261e06bd4c9"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const postsRef = ref(db, 'posts');

let allPosts = [];
let currentUser = null;

// 🛡️ Kiểm tra đăng nhập
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
    } else {
        // Nếu không ở trang login thì mới chuyển hướng
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }
});


onValue(postsRef, (snapshot) => {
    const data = snapshot.val();
    allPosts = data ? Object.keys(data).map(id => ({ id, ...data[id] })) : [];
    renderPosts(allPosts);
});


function renderPosts(postsToRender) {
    const feed = document.getElementById('feedContainer');
    if (!feed) return;
    feed.innerHTML = '';
    
    postsToRender.slice().reverse().forEach(post => {
        const div = document.createElement('div');
        div.className = 'post';
        div.innerHTML = `
            <div class="avatar-placeholder">
                <i data-lucide="user"></i>
            </div>
            <div style="flex: 1;">
                <div>
                    <span class="post-user">@${post.user || 'User'}</span>
                    <span style="color: #536471; font-size: 13px;">· ${new Date(post.timestamp).toLocaleDateString()}</span>
                </div>
                <div class="post-content">${post.content}</div>
                <div class="post-actions">
                    <div class="action-btn"><i data-lucide="message-circle" size="18"></i></div>
                    <div class="action-btn"><i data-lucide="repeat-2" size="18"></i></div>
                    <div class="action-btn"><i data-lucide="heart" size="18"></i></div>
                    <div class="action-btn"><i data-lucide="share" size="18"></i></div>
                </div>
            </div>
        `;
        feed.appendChild(div);
    });

    if (window.lucide) lucide.createIcons();
}


const submitBtn = document.getElementById('submitPost');
if (submitBtn) {
    submitBtn.addEventListener('click', () => {
        const input = document.getElementById('postInput');
        const content = input.value.trim();
        if (content) {
            push(postsRef, {
                user: currentUser ? currentUser.displayName || currentUser.email.split('@')[0] : "SayHi",
                content: content,
                timestamp: Date.now()
            });
            input.value = '';
        }
    });
}

// 🔍 Tìm kiếm
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allPosts.filter(p => 
            p.content.toLowerCase().includes(term) || 
            p.user.toLowerCase().includes(term)
        );
        renderPosts(filtered);
    });
}


const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => { window.location.href = 'login.html'; });
    });
}
