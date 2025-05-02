export default function ProfilePage() {
    return (
      <div>

        <h1 className="text-3xl font-bold underline">
          Your profile
        </h1>
        <button
          onClick={() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("refreshToken");
          window.location.href = "/";
        }}
        >
        Logout
        </button>

      </div>
    );
  }