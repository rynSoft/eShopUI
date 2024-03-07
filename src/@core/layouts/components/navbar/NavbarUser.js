// ** React Imports
import { Fragment, useState } from "react";

// ** Dropdowns Imports
import UserDropdown from "./UserDropdown";
import NotificationDropdown from "./NotificationDropdown";
// ** Third Party Components
import { Sun, Moon } from "react-feather";

// ** Reactstrap Imports
import { NavItem, NavLink } from "reactstrap";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { Input, Switch } from "antd";
const NavbarUser = (props) => {
  const [isDarkMode, setIsDarkMode] = useState();
  const { switcher, currentTheme, status, themes } = useThemeSwitcher();

  const toggleTheme = (isChecked) => {
    switcher({ theme: isChecked ? themes.light : themes.dark });
  };
  // ** Props
  const { skin, setSkin } = props;

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === "dark") {
      return (
        <Sun
          className="ficon"
          onClick={() => {
            setSkin("light"), toggleTheme(true);
          }}
        />
      );
    } else {
      return (
        <Moon
          className="ficon"
          onClick={() => {
            setSkin("dark"), toggleTheme(false);
          }}
        />
      );
    }
  };

  return (
    <Fragment>
      <div className="bookmark-wrapper d-flex align-items-center">
        <NavItem className="d-none d-lg-block">
          <NavLink className="nav-link-style">
            <ThemeToggler />
          </NavLink>
        </NavItem>
      </div>
      <ul className="nav navbar-nav align-items-center ms-auto">
        <NotificationDropdown />
        <UserDropdown />
      </ul>
    </Fragment>
  );
};
export default NavbarUser;
