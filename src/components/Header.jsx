import ShoppingCartSharpIcon from "@mui/icons-material/ShoppingCartSharp";
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Menu,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItemCount } from "../utils";
import { styled, alpha } from "@mui/material/styles";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { fetchAllCategories } from "../feature/categories-slice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { useAuth } from "../firebase/Auth";

const Search = styled("section")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
}));

const StyleAutoComplete = styled(Autocomplete)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiTextField-root": {
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
  },
  "& .MuiInputBase-input": {
    color: theme.palette.common.white,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiSvgIcon-root": {
    fill: theme.palette.common.white,
  },
}));

const SearchIconWrapper = styled("section")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  right: 0,
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.common.white,
  textDecoration: "none",
}));

function SearchBar() {
  const theme = useTheme();
  const products = useSelector((state) => state.products.value);
  const categories = useSelector((state) => state.categories?.value);
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const searchTerm = searchParams.get("searchterm");
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedCategory(category ? category : "all");
  }, [category]);

  if (!categories?.length) {
    dispatch(fetchAllCategories());
  }
  function handleCategoryChange(event) {
    const { value } = event.target;
    navigate(
      value === "all"
        ? "/"
        : `/?category=${value}${searchTerm ? "&searchterm=" + searchTerm : ""}`
    );
  }
  function handleSearchChange(searchText) {
    if (searchText) {
      navigate(
        selectedCategory === "all"
          ? `?searchterm=${searchText}`
          : `/?category=${selectedCategory}&searchterm=${searchText}`
      );
    } else {
      navigate(
        selectedCategory === "all" ? `/` : `/?category=${selectedCategory}`
      );
    }
  }
  return (
    <Search>
      <Select
        value={selectedCategory}
        size="small"
        variant="standard"
        labelId="selected-category"
        id="selected-category-id"
        onChange={handleCategoryChange}
        sx={{
          m: 1,
          textTransform: "capitalize",
          "&": {
            "::before": {
              ":hover": {
                border: "none",
              },
            },
            "::before, &::after": {
              border: "none",
            },
            ".MuiSelect-standard": {
              color: "common.white",
            },
            ".MuiSelect-iconStandard": {
              fill: theme.palette.common.white,
            },
          },
        }}
      >
        <MenuItem
          value="all"
          sx={{
            textTransform: "capitalize",
          }}
        >
          all
        </MenuItem>
        {categories?.map((category) => (
          <MenuItem
            value={category}
            key={category}
            sx={{
              textTransform: "capitalize",
            }}
          >
            {category}
          </MenuItem>
        ))}
      </Select>
      <StyleAutoComplete
        disablePortal
        id="selected-product"
        freeSolo
        onChange={(e, value) => {
          console.log(value);
          handleSearchChange(value?.label);
        }}
        options={Array.from(
          selectedCategory === "all"
            ? products
            : products.filter((prod) => prod.category === selectedCategory),
          (prod) => ({
            id: prod.id,
            label: prod.title,
          })
        )}
        renderInput={(params) => <TextField {...params} />}
      />
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
    </Search>
  );
}

function Header() {
  const { user, signOut } = useAuth();
  const cartItems = useSelector((state) => state.cart?.value);
  const count = getItemCount(cartItems);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  function navigateToCart() {
    navigate("/cart");
  }
  function handleMenuClose(){
    setAnchorEl(null);
  }
  function handleProfileMenuOpen(e){
    setAnchorEl(e.currentTarget);
  }
  async function logout(){
    await signOut();
    navigate("/login");
  }
  function login(){
    navigate("/login");
  }
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id="user-profile-menu"
      keepMounted
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
      <MenuItem onClick={logout}>Logout</MenuItem>
    </Menu>
  );
  return (
    <>
    <AppBar position="sticky" sx={{ py: 1 }}>
      <Toolbar sx={{ display: "flex", gap: 2 }}>
        <Typography variant="h6" color="inherit">
          <StyledLink to="/">QuickCart</StyledLink>
        </Typography>
        <SearchBar />
        <Box flexBasis={500} sx={{ display: { md: "flex" } }}>
          <IconButton
            size="large"
            aria-label="shows cart item count"
            color="inherit"
            onClick={navigateToCart}
          >
            <Badge badgeContent={count} color="error">
              <ShoppingCartSharpIcon />
            </Badge>
          </IconButton>
          {user ? (
            <Button onClick={handleProfileMenuOpen} color="inherit">
              Hello, {user?.displayName ?? user?.email}
            </Button>
          ) : (
            <Button color="inherit" onClick={login}>Login</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
    {renderMenu}
    </>
  );
}

export default Header;
