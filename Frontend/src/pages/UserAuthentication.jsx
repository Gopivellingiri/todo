import signImg from "../assets/signup-hero.png";
import googleIcon from "../assets/GoogleIcon.png";
import { Link, useNavigate } from "react-router-dom";
import AnimationWrapper from "../common/PageAnimation";
import { useEffect, useState } from "react";
import { loginUser, registerUser } from "../../Api";
import { toast } from "react-toastify";

const UserAuthentication = ({ type }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const token = userInfo?.token;

  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      setTimeout(() => navigate("/dashboard"), 100); // Small delay for safety
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (type === "sign-up") {
        await registerUser(formData);
        toast.success("Your registration is successful");
        navigate("/sign-in");
      } else {
        const data = await loginUser(formData);
        if (data?.token) {
          localStorage.setItem("userInfo", JSON.stringify(data));
          toast.success("You're logged in successfully");
          navigate("/dashboard");
        } else {
          toast.error("Login failed, please try again.");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    !token && (
      <header className="bg-gradient-to-tl from-[#4A90E2] to-[#0B61C5] h-screen w-full overflow-y-hidden">
        <nav className="nav_container font-bold text-2xl text-white relative ">
          <div className="!mb-15">
            <h1 className="font-display">Taskly.</h1>
          </div>
          <div className="grid place-items-center gap-3.5 w-1/2 h-full mt-5">
            <h1 className="font-display text-5xl leading-15">
              Stay Organized, <br /> Stay Productive
            </h1>
            <img className="" src={signImg} alt="" />
            <p className="text-base font-medium w-2xl text-center">
              Manage your tasks effortlessly.Plan, track, and complete your
              to-dos with ease. Let’s get things done!
            </p>
          </div>
          <div className="absolute top-0 right-0 bg-white h-screen w-1/2 rounded-l-[60px]">
            <AnimationWrapper
              keyValue={type}
              className="grid place-content-center gap-4 h-full"
            >
              <h1 className="text-[var(--primary-color)]">
                {type === "sign-up" ? "Create a Account" : "Welcome Back"}
              </h1>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col w-[450px] gap-6"
              >
                {type === "sign-up" ? (
                  <input
                    type="text"
                    name="fullName"
                    value={FormData.fullName}
                    onChange={handleChange}
                    className="inline-block !py-2 !px-3 bg-[var(--input-color)] text-[var(--secondary-color)] text-base font-medium border rounded-md border-[var(--input-stroke)] placeholder:text-[var(--input-stroke)] placeholder:text-base placeholder:font-medium"
                    placeholder="Full Name"
                  />
                ) : (
                  ""
                )}
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="inline-block !py-2 !px-3 bg-[var(--input-color)] text-[var(--secondary-color)] text-base font-medium border rounded-md border-[var(--input-stroke)] placeholder:text-[var(--input-stroke)] placeholder:text-base placeholder:font-medium"
                  placeholder="Email Address"
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="inline-block !py-2 !px-3 bg-[var(--input-color)] text-[var(--secondary-color)] text-base font-medium border rounded-md border-[var(--input-stroke)] placeholder:text-[var(--input-stroke)] placeholder:text-base placeholder:font-medium"
                  placeholder="Password"
                />

                <button
                  className="inline-block !py-2 !px-3 bg-[var(--primary-color)] rounded-md text-base font-bold cursor-pointer"
                  type="submit"
                  disabled={loading}
                  style={{
                    pointerEvents: loading ? "none" : "auto",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading
                    ? "Processing..."
                    : type === "sign-up"
                    ? "Sign Up"
                    : "Sign In"}
                </button>
                <div className="flex items-center gap-3">
                  <hr className="border-[var(--input-stroke)] w-1/2" />
                  <p className="text-[var(--input-stroke)] text-base font-[300px] ">
                    Or
                  </p>
                  <hr className="border-[var(--input-stroke)] w-1/2" />
                </div>
                <button className="!py-2 !px-3 bg-[var(--secondary-color)] rounded-md text-base font-bold cursor-pointer flex items-center justify-center gap-3">
                  <img src={googleIcon} alt="" />
                  <span>Continue With Google</span>
                </button>
                <div>
                  <span className="text-[var(--secondary-color)] font-medium text-base flex items-center justify-center gap-1">
                    {type === "sign-up"
                      ? "Already have an account?"
                      : "Don't you have an account?"}
                    <Link
                      to={`${type === "sign-up" ? "/sign-in" : "/"}`}
                      className="font-bold underline text-[var(--primary-color)] "
                    >
                      {type === "sign-up" ? "Sign In" : "Sign Up"}
                    </Link>
                  </span>
                </div>
              </form>
            </AnimationWrapper>
          </div>
        </nav>
      </header>
    )
  );
};

export default UserAuthentication;
