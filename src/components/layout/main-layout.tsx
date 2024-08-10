import { axios } from "@/libs/axios";
import { getUser } from "@/libs/jwt-decode";
import { VideoCameraOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import React from "react";
import { FaUser } from "react-icons/fa";
import { MdOutlineEventAvailable } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";

import dayjs from "@/libs/dayjs";

const getGreeting = () => {
  const timeZone = dayjs.tz.guess();

  const currentTime = dayjs().tz(timeZone);

  const hour = currentTime.hour();

  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  } else if (hour >= 17 && hour < 21) {
    return "Good evening";
  } else {
    return "Good night";
  }
};

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const navigationItems = [
  {
    key: "/app/dashboard",
    label: "Dashboard",
    icon: <RxDashboard size={16} />,
  },
  {
    key: "/app/event",
    label: "Event",
    icon: <MdOutlineEventAvailable size={16} />,
  },
  {
    key: "/app/booking",
    label: "Booking",
    icon: <VideoCameraOutlined size={16} />,
  },
];

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const user = getUser();
  const navigate = useNavigate();

  const items = navigationItems.map((item) => {
    return getItem(
      <Link to={item?.key} className="text-md font-sans">
        {item.label}
      </Link>,
      item?.key,
      item.icon
    );
  });

  const handleLogout = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    axios
      .post("/auth/logout")
      .then(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/");
      })
      .catch((err) => console.log("errrrr", err));
  };

  const getFirstName = () => {
    const user = getUser();

    if (user && user.fullName) {
      const nameArray = user.fullName.split(" ");

      return nameArray[0];
    }
    return;
  };

  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="flex flex-col justify-between h-full py-5">
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[window.location.pathname]}
            items={items}
          />

          <div className=" p-5">
            <h3 className="text-white flex gap-2 items-center text-md">
              <span>
                <FaUser />
              </span>
              {user?.fullName as string}
            </h3>
          </div>
        </div>
      </Sider>
      <Layout style={{ marginLeft: 200, backgroundColor: "#fff" }}>
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
          }}
        >
          <section>
            <div className="flex items-center mb-5">
              <h4 className="text-lg mr-auto">{`${getGreeting()} ${getFirstName()}!`}</h4>

              <div className="flex justify-end">
                <Button onClick={handleLogout} className="border">
                  Logout
                </Button>
              </div>
            </div>
            {children}
          </section>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
