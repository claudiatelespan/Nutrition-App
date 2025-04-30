export default function ProfilePage() {
    return (
      <div>

        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
        <button
          onClick={() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/";
        }}
        >
        Logout
        </button>

      </div>

  
    );
  }