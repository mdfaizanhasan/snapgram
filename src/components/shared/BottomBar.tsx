import { bottombarLinks } from "@/constants";
import { INavLink } from "@/types";
import { Link, useLocation } from "react-router-dom"

const BottomBar = () => {
  const { pathname } = useLocation();
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
                <Link
                to={link.route}
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                } flex-col gap-1 flex-center p-2 transition`}>
                <img
                  src={link.imgURL}
                  alt={link.label}
                  width={16}
                  height={16}
                  className={`${
                      isActive && "invert-white"
                    }`}
                />
                <p className="tiny-medium text-light-2">
                  {link.label}
                </p>
                </Link>
            );
          })}
    </section>
  )
}

export default BottomBar