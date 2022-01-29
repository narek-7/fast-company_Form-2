import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Qualities from "../../ui/qualities";
import PropTypes from "prop-types";
import api from "../../../api";
import EditForm from "../../ui/editForm";

const UserPage = ({ userId }) => {
    const { edit } = useParams();
    const [user, setUser] = useState();
    useEffect(() => {
        api.users.getById(userId).then((data) => setUser(data));
    }, []);

    if (user) {
        if (edit === "edit") {
            return <EditForm user={user} />;
        } else {
            return (
                <div>
                    <h1> {user.name}</h1>
                    <h2>Профессия: {user.profession.name}</h2>
                    <Qualities qualities={user.qualities} />
                    <p>completedMeetings: {user.completedMeetings}</p>
                    <h2>Rate: {user.rate}</h2>
                    <button>
                        <Link to={`/users/${userId}/edit`}>Изменить</Link>
                    </button>
                </div>
            );
        }
    } else {
        return <h1>Loading</h1>;
    }
};

UserPage.propTypes = {
    userId: PropTypes.string.isRequired
};

export default UserPage;
