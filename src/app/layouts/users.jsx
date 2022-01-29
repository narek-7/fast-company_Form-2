import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserPage from "../components/page/userPage";
import UsersListPage from "../components/page/usersListPage";
import api from "../api/index";

const Users = () => {
    const params = useParams();
    const { userId } = params;

    const [users, setUsers] = useState();
    useEffect(() => {
        api.users.fetchAll().then((data) => setUsers(data));
    }, []);

    const handleUsersUpdate = (id, data) => {
        api.users.update(id, data).then((data) => setUsers(data));
    };

    const handleDelete = (userId) => {
        setUsers(users.filter((user) => user._id !== userId));
    };
    const handleToggleBookMark = (id) => {
        const newArray = users.map((user) => {
            if (user._id === id) {
                return { ...user, bookmark: !user.bookmark };
            }
            return user;
        });
        setUsers(newArray);
    };

    return (
        <>
            {userId ? (
                <UserPage
                    userId={userId}
                    handleUsersUpdate={handleUsersUpdate}
                />
            ) : (
                <UsersListPage
                    users={users}
                    handleDelete={handleDelete}
                    handleToggleBookMark={handleToggleBookMark}
                />
            )}
        </>
    );
};

export default Users;
