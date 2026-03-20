// 1. Nhập các thư viện cần thiết từ Google
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 2. Chìa khóa kết nối (Config của SayHi)
const firebaseConfig = {
  apiKey: "AIzaSyAzn2X18AOgN59nc1O_RnHT2AJDRINYu7M",
  authDomain: "sayhiwithme-0000002.firebaseapp.com",
  projectId: "sayhiwithme-0000002",
  storageBucket: "sayhiwithme-0000002.firebasestorage.app",
  messagingSenderId: "330846125548",
  appId: "1:330846125548:web:f308385a1aa261e06bd4c9",
  databaseURL: "https://sayhiwithme-0000002-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// 3. Khởi tạo
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const postsRef = ref(db, 'posts');

let allPosts = []; // Kho chứa tạm để lọc tìm kiếm

// 🛡️ BUG FIX: Luôn kiểm tra đăng nhập khi vào trang
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'login.html'; // Nếu chưa login, đá sang trang login
    }
});

// 🔄 BUG FIX: Lấy dữ liệu từ Firebase (Hết lỗi Reload bay màu)
onValue(postsRef, (snapshot) => {
    const data = snapshot.val();
    // Chuyển dữ liệu từ dạng Object sang Array để dễ xử lý
    allPosts = data ? Object.keys(data).map(id => ({ id, ...data[id] })) : [];
    renderPosts(allPosts);
});

// 🎨 Hàm vẽ bài đăng lên màn hình (Có Avatar mặc định)
function renderPosts(postsToRender) {
    const feed = document.getElementById('feedContainer');
    feed.innerHTML = '';
    
    // Đảo ngược mảng để bài mới nhất lên đầu
    postsToRender.slice().reverse().forEach(post => {
        const div = document.createElement('div');
        div.className = 'post';
        div.innerHTML = `
            <div style="display: flex; gap: 12px; align-items: flex-start;">
                <div class="default-avatar">👤</div> 
                <div style="flex: 1;">
                    <div class="post-user">@${post.user || 'User'}</div>
                    <div class="post-content">${post.content}</div>
                </div>
            </div>
        `;
        feed.appendChild(div);
    });
}

// 🔍 BUG FIX: Xử lý tìm kiếm
document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allPosts.filter(p => 
        p.content.toLowerCase().includes(term) || 
        p.user.toLowerCase().includes(term)
    );
    renderPosts(filtered);
});

// 📤 Gửi bài đăng lên mây
document.getElementById('submitPost').addEventListener('click', () => {
    const content = document.getElementById('postInput').value.trim();
    if (content) {
        push(postsRef, {
            user: "SayHiWithMe", // Sau này lấy từ auth.currentUser.email
            content: content,
            timestamp: Date.now(),
            likes: 0
        });
        document.getElementById('postInput').value = '';
    }
});

// 🚪 Nút Đăng xuất
const logoutBtn = document.getElementById('logoutBtn');
if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => { window.location.href = 'login.html'; });
    });
}
