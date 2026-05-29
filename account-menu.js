function getCustomerLastName(fullName) {
  if (!fullName) {
    return "";
  }

  const parts = fullName.trim().split(/\s+/);
  return parts[parts.length - 1] || "";
}

function getSavedProfile() {
  let profile = null;

  try {
    profile = JSON.parse(localStorage.getItem("profile") || "null");
  } catch (error) {
    profile = null;
  }

  return profile;
}

function renderAccountMenu() {
  const navAccount = document.getElementById("navAccount");

  if (!navAccount) {
    return;
  }

  const profile = getSavedProfile();
  const currentUserEmail = localStorage.getItem("currentUserEmail");

  if (!profile && !currentUserEmail) {
    navAccount.innerHTML = `
      <a href="/login" class="nav-login-link">Đăng nhập</a>
    `;
    return;
  }

  const fullName = profile && profile.name ? profile.name : "";
  const lastName = getCustomerLastName(fullName);
  const displayName = lastName || "bạn";

  navAccount.innerHTML = `
    <span class="nav-account-name">Xin chào, ${displayName}</span>

    <div class="account-dropdown">
      <a href="/login">Thông tin cá nhân</a>
      <a href="/cart">Giỏ hàng của tôi</a>
      <a href="/checkout">Thanh toán</a>
      <button type="button" class="account-logout" onclick="logoutFromNavbar()">Đăng xuất</button>
    </div>
  `;
}

function logoutFromNavbar() {
  localStorage.removeItem("profile");
  localStorage.removeItem("currentUserEmail");

  window.location.href = "/";
}

document.addEventListener("DOMContentLoaded", renderAccountMenu);
