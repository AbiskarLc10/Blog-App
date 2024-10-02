import React, { useEffect, useState } from "react";
import { Alert, Table } from "flowbite-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { TiTick } from "react-icons/ti";
import { GiCrossedBones } from "react-icons/gi";
import { Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState({ show: false, id: null });

  const [showMore, setShowMore] = useState(true);

  const { isAdmin } = currentUser.rest;
  console.log(isAdmin);
  const [users, setUsers] = useState([]);

  const getUserData = async () => {
    try {
      await axios
        .get("http://localhost:8000/api/user/getusers?sort=asc", {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
          setUsers(res.data.users);
          if (res.data.users.length < 7) {
            setShowMore(false);
          }

          setError(null);
        })
        .catch((err) => {
          setError(err.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowMore = async () => {
    const startIndex = users.length;

    try {
      await axios
        .get(
          `http://localhost:8000/api/user/getusers?sort=asc&startIndex=${startIndex}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log(res.data);
          setUsers((prev) => {
            return [...prev, ...res.data.users];
          });
          if (res.data.users.length < 7) {
            setShowMore(false);
          }

          setError(null);
        })
        .catch((err) => {
          setError(err.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios
        .delete(`http://localhost:8000/api/user/delete/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          setUsers((prev) => prev.filter((user) => user._id !== id));
          setShowModal({ show: false });
          setError(null);
        })
        .catch((err) => {
          setError(err.response.data.message);
          setShowModal({ show: false, id: null });
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      getUserData();
    }
  }, []);
  return (
    <div className="min-h-screen md:mx-auto overflow-x-auto mt-2  scrollbar scrollbar-track-slate-300 scrollbar-thumb-slate-400 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-800">
      {isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md cursor-pointer">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Profile</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {users.map((user, index) => {
                return (
                  <>
                    <Table.Row key={user._id}>
                      <Table.Cell>
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <div className=" w-16 h-16">
                          <img
                            src={user.profilePicture}
                            alt="user profile"
                            className="w-16 h-16 rounded-full"
                          />
                        </div>
                      </Table.Cell>
                      <Table.Cell>{user.username}</Table.Cell>
                      <Table.Cell>{user.email}</Table.Cell>
                      <Table.Cell>
                        {user.isAdmin ? (
                          <TiTick className="text-2xl text-green-500" />
                        ) : (
                          <GiCrossedBones className=" text-xl text-red-500" />
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <span
                          className="text-red-500 underline cursor-pointer hover:[text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-red-500"
                          onClick={() =>
                            setShowModal({ show: true, id: user._id })
                          }
                        >
                          delete
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  </>
                );
              })}
            </Table.Body>
          </Table>
          {error && (
            <Alert color={"failure"}>
              <p>{error}</p>
            </Alert>
          )}
          {showMore && (
            <Button
              className="py-3 self-center mx-auto text-teal-400 dark:text-gray-800 w-full text-sm"
              onClick={handleShowMore}
            >
              Show more
            </Button>
          )}
        </>
      ) : (
        <>
          <div className="text-center text-2xl text-gray-500">
            <p>No users Available</p>
          </div>
        </>
      )}
      <Modal
        show={showModal.show}
        size={"md"}
        className=" mt-32 md:mt-0"
        onClose={() => setShowModal({ show: false, id: null })}
        popup
      >
        <Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
              <h1 className="text-lh mb-5 text-gray-500 dark:text-gray-200">
                Are you sure you want to delete this user?
              </h1>
            </div>
            <div className="flex justify-center gap-4 p-1">
              <Button color="failure" onClick={() => deleteUser(showModal.id)}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </Modal.Body>
        </Modal.Header>
      </Modal>
    </div>
  );
};

export default DashUsers;
