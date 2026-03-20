import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAzn2X18AOgN59nc1O_RnHT2AJDRINYu7M",
  authDomain: "sayhiwithme-0000002.firebaseapp.com",
  projectId: "sayhiwithme-0000002",
  storageBucket: "sayhiwithme-0000002.firebasestorage.app",
  messagingSenderId: "330846125548",
  appId: "1:330846125548:web:f308385a1aa261e06bd4c9",
  databaseURL: "https://sayhiwithme-0000002-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const postsRef = ref(db, 'posts');

let allPosts = []; 

onValue(postsRef, (snapshot) => {
    const data = snapshot.val();
    allPosts = data ? Object.keys(data).map(id => ({ id, ...data[id] })) : [];
    renderPosts(allPosts);
});

function renderPosts(postsToRender) {
    const feed = document.getElementById('feedContainer');
    feed.innerHTML = '';
    
    postsToRender.slice().reverse().forEach(post => {
        const div = document.createElement('div');
        div.className = 'post';
        div.innerHTML = `
            <div style="display: flex; gap: 10px;">
                <div class="default-avatar">👤</div> 
                <div style="flex: 1;">
                    <div class="post-user">@${post.user || 'Anonymous'}</div>
                    <div class="post-content">${post.content}</div>
                </div>
            </div>
        `;
        feed.appendChild(div);
    });
}


document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allPosts.filter(p => 
        p.content.toLowerCase().includes(term) || 
        p.user.toLowerCase().includes(term)
    );
    renderPosts(filtered);
});


document.getElementById('submitPost').addEventListener('click', () => {
    const content = document.getElementById('postInput').value.trim();
    if (content) {
        push(postsRef, {
            user: "SayHiWithMe",
            content: content,
            timestamp: Date.now()
        });
        document.getElementById('postInput').value = '';
    }
});
