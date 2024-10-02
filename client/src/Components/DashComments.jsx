import React, { useEffect, useState } from "react";
import { Alert, Table } from "flowbite-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { TiTick } from "react-icons/ti";
import { GiCrossedBones } from "react-icons/gi";
import { Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashComments = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState({ show: false, id: null });
    const [showMore, setShowMore] = useState(true);
    const { isAdmin } = currentUser.rest;
    const [comments, setComments] = useState([]);
  
    const getCommentsData = async () => {
      try {
        await axios
          .get("http://localhost:8000/api/comment/getAllComments?sort=asc", {
            withCredentials: true,
          })
          .then((res) => {
            console.log(res.data);
            setComments(res.data.comments);
            if (res.data.comments.length < 10) {
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
      const startIndex = comments.length;
  
      try {
        await axios
          .get(
            `http://localhost:8000/api/comment/getAllComments?sort=asc&startIndex=${startIndex}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            console.log(res.data);
            setComments((prev) => {
              return [...prev, ...res.data.comments];
            });
            if (res.data.comments.length < 10) {
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
  
    const deleteComment = async (id) => {
      try {
        await axios
          .delete(`http://localhost:8000/api/comment/deleteComment/${id}`, {
            withCredentials: true,
          })
          .then((res) => {
            setComments((prev) => prev.filter((comment) => comment._id !== id));
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
        getCommentsData();
      }
    }, []);
    return (
      <div className="min-h-screen md:mx-auto overflow-x-auto mt-2  scrollbar scrollbar-track-slate-300 scrollbar-thumb-slate-400 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-800">
        {isAdmin && comments.length > 0 ? (
          <>
            <Table hoverable className="shadow-md cursor-pointer">
              <Table.Head>
                <Table.HeadCell>Date Updated</Table.HeadCell>
                <Table.HeadCell>Content</Table.HeadCell>
                <Table.HeadCell>numberofLikes</Table.HeadCell>
                <Table.HeadCell>postId</Table.HeadCell>
                <Table.HeadCell>userId</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {comments.map((comment, index) => {
                  return (
                    <>
                      <Table.Row key={comment._id}>
                        <Table.Cell>
                          {new Date(comment.updatedAt).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell>
                            {comment.content}
                        </Table.Cell>
                        <Table.Cell>{comment.numberofLikes}</Table.Cell>
                        <Table.Cell>{comment.postId}</Table.Cell>
                        <Table.Cell>{comment.userId}</Table.Cell>
                        <Table.Cell>
                          <span
                            className="text-red-500 underline cursor-pointer hover:[text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-red-500"
                            onClick={() =>
                              setShowModal({ show: true, id: comment._id })
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
              <p>No Comments Available</p>
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
                  Are you sure you want to delete this comment?
                </h1>
              </div>
              <div className="flex justify-center gap-4 p-1">
                <Button color="failure" onClick={() => deleteComment(showModal.id)}>
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
}

export default DashComments
