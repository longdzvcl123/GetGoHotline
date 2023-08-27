import classes from "./CreateBill.module.scss";
import { IconBtn, ToolBtn } from "~components/Layout/DefaultLayout/Button";
import {
  faLocationDot,
  faLocationCrosshairs,
  faChevronRight,
  faChevronLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import SearchBar from "~components/Layout/DefaultLayout/SearchBar";
import Pagination from "~components/Layout/DefaultLayout/Pagination/Pagination";
import React, { useState, useMemo, useEffect } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

import TextField from "@mui/material/TextField";
import Select from "react-select";
import FadeInOut from "~components/FadeInOut";
import Swal from "sweetalert2";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoongAutoComplete from "~components/GoongAutoComplete";
import { colors } from "~utils/base";

const CreateBill = () => {
  const [listHistory, setListHistory] = useState([]);

  let pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return listHistory.slice(firstPageIndex, lastPageIndex);
  }, [pageSize, currentPage, listHistory]);

  const [screen, setScreen] = useState(1);
  const [fadeInOut, setFadeInOut] = useState(true);

  const [phone, setPhone] = useState();
  const [vehicleType, setVehicleType] = useState();
  const [origin, setOrigin] = useState({
    address_pickup: "",
    lat_pickup: "",
    long_pickup: "",
  });
  const [destination, setDestination] = useState({
    address_destination: "",
    lat_destination: "",
    long_destination: "",
  });

  const options = [
    { value: 1, label: "Xe máy" },
    { value: 4, label: "Xe hơi 4 chỗ" },
    { value: 7, label: "Xe hơi 7 chỗ" },
  ];

  const duration = 200;

  const handleCreateBill = async () => {
    if (!phone || !vehicleType || !origin || !destination)
      Swal.fire({
        icon: "error",
        title: "Tạo đơn thất bại",
        text: "Vui lòng điền đầy đủ thông tin",
        width: "50rem",
        confirmButtonColor: colors.primary_900,
      });
    else {
      const dataPost = {
        address_destination: destination.address_destination,
        address_pickup: origin.address_pickup,
        lat_destination: destination.lat_destination,
        lat_pickup: origin.lat_pickup,
        long_destination: destination.long_destination,
        long_pickup: origin.long_pickup,
        phone: phone,
        price: 200,
        status: "Picking Up",
        vehicleType: vehicleType.value,
      };

      await axios
        .post("http://localhost:3007/hotlines/trips", dataPost)
        .then(response => {
          console.log(response);
          Swal.fire({
            icon: "success",
            title: "Tạo đơn thành công!",
            width: "50rem",
            confirmButtonColor: colors.primary_900,
          }).then(function () {
            // window.location.reload(false);
          });
        })
        .catch(error => {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Thông tin chưa chính xác!",
            width: "50rem",
            confirmButtonColor: colors.primary_900,
          });
        });
    }
  };

  const headers =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZDM3Yzk0Y2UzNTBhMDM3YjhjODFiNyIsInJvbGUiOiJIb3RsaW5lIiwiaWF0IjoxNjkzMTI5NjQyLCJleHAiOjE2OTMxMzY4NDJ9.GzbXWfPdca43sbi79LprRaNMnfA9UipunSA6yNVg2KM";

  const handleSearchPhone = inputPhone => {
    setPhone(inputPhone);
    axios
      .get(`http://localhost:3007/hotlines/trips-customer-phone`, {
        params: {
          phone: inputPhone,
        },
      })
      .then(response => {
        console.log(response, inputPhone);
        const data = [];
        response.data.forEach(element => {
          data.push(element);
        });
        setListHistory(data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  };

  const handleUpdateOrigin = e => {
    setOrigin({
      address_pickup: e.value,
      lat_pickup: null,
      long_pickup: null,
    });
  };

  const handleUpdateDestination = e => {
    setDestination({
      address_destination: e.value,
      lat_destination: null,
      long_destination: null,
    });
  };

  const notify = content => toast.success(content);

  return (
    <>
      <div className={classes["title-container"]}>
        <h1>Tạo đơn</h1>
        <div className={classes["pagination-btn-container"]}>
          <div className={classes["IconBtn"]}>
            <IconBtn
              title="Quay lại"
              iconLeft={faChevronLeft}
              width={100}
              disable={screen === 1 ? true : false}
              onClick={() => {
                setFadeInOut(false);
                setTimeout(() => {
                  setScreen(1);
                  setFadeInOut(true);
                }, duration + 100);
              }}
            />
          </div>
          <div className={classes["IconBtn"]}>
            {screen === 1 ? (
              <IconBtn
                title="Tiếp tục"
                iconRight={faChevronRight}
                width={100}
                onClick={() => {
                  setFadeInOut(false);
                  setTimeout(() => {
                    setScreen(2);
                    setFadeInOut(true);
                  }, duration + 100);
                }}
              />
            ) : (
              <IconBtn
                title="Tạo đơn"
                iconRight={faPlus}
                width={100}
                onClick={() => handleCreateBill()}
              />
            )}
          </div>
        </div>
      </div>
      {screen === 1 ? (
        <FadeInOut show={fadeInOut} duration={duration}>
          <div className={classes["screen1-container"]}>
            <div className={classes["searchBar-container"]}>
              <div className={classes["search-text"]}>
                Nhập số điện thoại khách hàng
              </div>
              <SearchBar
                label="Nhập số điện thoại"
                handleSearchPhone={handleSearchPhone}
              />
            </div>
            <div className={classes["divLine"]} />
            <div className={classes["table-title"]}>
              Các địa điểm đi nhiều nhất
            </div>

            <div className={classes["table-container"]}>
              <div className={classes["table-container-title"]}>
                <div
                  className={`${classes["table-container-no"]} ${classes["title"]}`}
                >
                  STT
                </div>
                <div
                  className={`${classes["table-container-origin"]} ${classes["title"]}`}
                >
                  Điểm đón
                </div>
                <div
                  className={`${classes["table-container-destination"]} ${classes["title"]}`}
                >
                  Điểm đến
                </div>
                <div className={`${classes["table-container-tools"]}`} />
              </div>
              <div className={classes["table-container-content"]}>
                {currentTableData.map((item, index) => (
                  <div
                    className={classes["table-container-content-item"]}
                    key={index}
                  >
                    <div
                      className={`${classes["table-container-no"]} ${classes["item"]}`}
                    >
                      {pageSize * (currentPage - 1) + index + 1}
                    </div>
                    <div
                      className={`${classes["table-container-origin"]} ${classes["item"]}`}
                    >
                      {item.address_pickup}
                    </div>
                    <div
                      className={`${classes["table-container-destination"]} ${classes["item"]}`}
                    >
                      {item.address_destination}
                    </div>
                    <div
                      className={`${classes["table-container-tools"]} ${classes["item"]}`}
                    >
                      <div
                        className={classes["ToolBtn"]}
                        onClick={() => {
                          setOrigin({
                            address_pickup: item.address_pickup,
                            lat_pickup: item.lat_pickup,
                            long_pickup: item.long_pickup,
                          });
                          notify("Đã copy điểm đón " + item.address_pickup);
                        }}
                      >
                        <ToolBtn icon={faLocationDot} />
                      </div>
                      <div
                        className={classes["ToolBtn"]}
                        onClick={() => {
                          setDestination({
                            address_destination: item.address_destination,
                            lat_destination: item.lat_destination,
                            long_destination: item.long_destination,
                          });
                          notify(
                            "Đã copy điểm đến " + item.address_destination
                          );
                        }}
                      >
                        <ToolBtn icon={faLocationCrosshairs} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={classes["pagination-bar-container"]}>
              <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={listHistory.length}
                pageSize={pageSize}
                onPageChange={page => setCurrentPage(page)}
              />
            </div>
          </div>
        </FadeInOut>
      ) : (
        <FadeInOut show={fadeInOut} duration={duration}>
          <div className={classes["screen2-container"]}>
            <div className={classes["input-container"]}>
              <div className={classes["input-label"]}>Số điện thoại</div>
              <TextField
                defaultValue={phone}
                variant="outlined"
                label={"Số điện thoại"}
                size="small"
                fullWidth
                style={{ backgroundColor: "white" }}
                onChange={event => setPhone(event.target.value)}
                InputProps={{
                  classes: {
                    notchedOutline: classes["input-border"],
                  },
                }}
                InputLabelProps={{
                  classes: {
                    focused: classes.inputLabel,
                  },
                }}
              />
            </div>
            <div className={classes["input-container"]}>
              <div className={classes["input-label"]}>Loại xe</div>
              <Select
                options={options}
                onChange={setVehicleType}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderColor: colors.primary_900,
                    boxShadow: state.isFocused
                      ? `0 0 0 1px ${colors.primary_900}`
                      : "none",
                    "&:hover": {
                      borderColor: colors.primary_900,
                    },
                  }),
                }}
              />
            </div>
            <div className={classes["input-container"]}>
              <div className={classes["input-label"]}>Điểm đón</div>
              <GoongAutoComplete
                apiKey={process.env.REACT_APP_GOONG_APIKEY}
                onChange={handleUpdateOrigin}
                borderColorFocus={colors.primary_900}
                borderColor={colors.primary_900}
                defaultInputValue={origin.address_pickup}
              />
            </div>
            <div className={classes["input-container"]}>
              <div className={classes["input-label"]}>Điểm đến</div>
              <GoongAutoComplete
                apiKey={process.env.REACT_APP_GOONG_APIKEY}
                onChange={handleUpdateDestination}
                borderColorFocus={colors.primary_900}
                borderColor={colors.primary_900}
                defaultInputValue={destination.address_destination}
              />
            </div>
          </div>
        </FadeInOut>
      )}
      <ToastContainer position="top-left" autoClose={3000} theme="light" />
    </>
  );
};

export default CreateBill;
