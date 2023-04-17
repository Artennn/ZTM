import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import RoomIcon from "@mui/icons-material/Room";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RouteIcon from "@mui/icons-material/Route";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import { useState } from "react";
import { useRouter } from "next/dist/client/router";
import { signOut, useSession } from "next-auth/react";
import { trpc } from "utils/trpc";
import Image from "next/image";

const SideBarItems = [
  { label: "Kokpit", icon: DashboardIcon, href: "/" },
  { label: "Linie", icon: RouteIcon, href: "/line" },
  { label: "Przystanki", icon: RoomIcon, href: "/busStop" },
  { label: "Pojazdy", icon: DirectionsBusIcon, href: "/vehicle" },
  { label: "Kierowcy", icon: PersonIcon, href: "/driver" },
  { label: "Ustawienia", icon: SettingsIcon, href: "/settings" },
];

const SideBar = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const [open, setOpen] = useState(true);

  const { isLoading, data: user } = trpc.user.get.useQuery(
    sessionData?.user?.id || ""
  );

  const currentItem = SideBarItems.find((item) => {
    if (item.href === "/" && router.asPath !== item.href) return false;
    return router.asPath.startsWith(item.href);
  });

  return (
    <Stack
      direction="column"
      width={open ? 200 : 70}
      p={1}
      spacing={1}
      sx={{
        transition: "width 1s",
        overflowX: "hidden",
        border: (theme) => theme.border.primary,
      }}
    >
      <Stack direction="row">
        <Box
          sx={{
            display: "flex",
            m: "auto",
            ml: 0.5,
            width: open ? 80 : 0,
            transition: "width",
            transitionDelay: !open ? "1s" : "0s",
            overflow: "hidden",
          }}
        >
          <Image src="/lubika-logo.svg" alt="logo" width={90} height={40} />
        </Box>
        <IconButton
          onClick={() => setOpen(!open)}
          sx={{
            ml: "auto",
            mr: open ? 0 : 1,
            transition: "margin-right 1s",
          }}
        >
          {open ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
        </IconButton>
      </Stack>

      {SideBarItems.map((item, key) => (
        <Tooltip title={item.label} placement="right" arrow key={key}>
          <Stack
            direction="row"
            onClick={() => router.push(item.href)}
            sx={{
              width: "100%",
              p: 1,
              cursor: "pointer",
              justifyContent: open ? "initial" : "center",
              background: (theme) =>
                currentItem === item
                  ? theme.gradient.selected
                  : theme.gradient.primary,
              "&:hover": {
                background: (theme) => theme.gradient.hover,
              },
            }}
          >
            <item.icon fontSize="large" />

            <Box
              sx={{
                display: "flex",
                minWidth: "0px",
                opacity: open ? 1 : 0,
                flex: "1 1 auto",
                transition: "opacity",
                transitionDelay: !open ? "1s" : "0s",
                overflow: "hidden",
              }}
            >
              <Typography
                component="span"
                fontSize="1rem"
                sx={{ m: "auto 0", ml: 1 }}
              >
                {item.label}
              </Typography>
            </Box>
          </Stack>
        </Tooltip>
      ))}

      <Stack
        direction="row"
        marginTop="auto !important"
        sx={{
          width: "100%",
          p: 1,
          cursor: "pointer",
          justifyContent: open ? "initial" : "center",
          background: (theme) => theme.gradient.primary,
        }}
      >
        <Avatar sx={{ width: 35, height: 35 }} />

        <Box
          sx={{
            display: "flex",
            minWidth: "0px",
            opacity: open ? 1 : 0,
            flex: "1 1 auto",
            transition: "opacity",
            transitionDelay: !open ? "1s" : "0s",
            overflow: "hidden",
          }}
        >
          <Typography
            component="span"
            fontSize="1rem"
            sx={{ m: "auto 0", ml: 1 }}
          >
            {isLoading || !user ? "..." : user.username}
          </Typography>

          <Tooltip title="Wyloguj" placement="top" arrow>
            <IconButton sx={{ ml: "auto" }} onClick={() => signOut()}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Stack>
    </Stack>
  );
};

export default SideBar;
