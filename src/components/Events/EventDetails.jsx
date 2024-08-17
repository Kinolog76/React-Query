import { Link, Outlet, useParams, useNavigate } from "react-router-dom";

import Header from "../Header.jsx";
import { fetchEvent, deleteEvent, queryClient } from "../../utils/http.js";
import { useQuery, useMutation } from "@tanstack/react-query";
import LoadingIndicator from "./../UI/LoadingIndicator";
import ErrorBlock from "./../UI/ErrorBlock";
import { useState } from "react";
import Modal from "../UI/Modal.jsx";

export default function EventDetails() {
  const [deleting, setDeleting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  function handleDeleting() {
    setDeleting((prev) => !prev);
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["events", id ],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
  });

  const {
    mutate,
    isPending: isPendingDeletion,
    isError: isErrorDeleting,
    error: errorDeleting,
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"], refetchType: "none" });
      navigate("/events");
    },
  });

  function handleDelete(id) {
    console.log(mutate);
    mutate({ id });
  }

  return (
    <>
      {deleting && (
        <Modal>
          {(isPendingDeletion && <h2>Deleting, please wait...</h2>) || (
            <h2>Do you want delete event?</h2>
          )}

          <div className="form-actions">
            {!isPendingDeletion && (
              <p>
                <button onClick={handleDeleting} className="button-text">
                  No
                </button>
                <button onClick={() => handleDelete(id)} className="button">
                  Yes
                </button>
              </p>
            )}
          </div>
          {isErrorDeleting && (
            <ErrorBlock title="An error occurred" message={errorDeleting.info?.message} />
          )}
        </Modal>
      )}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {isLoading && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <LoadingIndicator />
        </div>
      )}
      {isError && <ErrorBlock title="An error occurred" message={error.info?.message} />}
      {data && (
        <article id="event-details">
          <header>
            <h1>{data.title}</h1>
            <nav>
              <button onClick={handleDeleting}>Delete</button>
              <Link to="edit">Edit</Link>
            </nav>
          </header>
          <div id="event-details-content">
            <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
            <div id="event-details-info">
              <div>
                <p id="event-details-location">{data.location}</p>
                <time dateTime={`Todo-DateT$Todo-Time`}>
                  {data.date} / {data.time}
                </time>
              </div>
              <p id="event-details-description">{data.description}</p>
            </div>
          </div>
        </article>
      )}
    </>
  );
}