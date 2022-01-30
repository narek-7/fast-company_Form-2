import React, { useEffect, useState } from "react";
import MultiSelectField from "../common/form/multiSelectField";
import SelectField from "../common/form/selectField";
import RadioField from "../common/form/radioField";
import { validator } from "../../utils/validator";
import TextField from "../common/form/textField";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import api from "../../api";

const EditForm = ({ user, userId }) => {
    const [data, setData] = useState({
        email: user.email,
        name: user.name,
        profession: ".",
        sex: "male",
        qualities: []
    });

    const [qualities, setQualities] = useState({});
    const [professions, setProfession] = useState();
    const [errors, setErrors] = useState({});
    const history = useHistory();

    useEffect(() => {
        api.professions.fetchAll().then((data) => setProfession(data));
        api.qualities.fetchAll().then((data) => setQualities(data));
    }, []);

    useEffect(() => {
        setData(data);
    }, [data]);

    const isValid = Object.keys(errors).length === 0;

    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };

    const validatorConfig = {
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Email введен некорректно"
            }
        },
        name: {
            isRequired: {
                message: "Имя обязателен для заполнения"
            }
        },
        profession: {
            isRequired: {
                message: "Обязательно выберите вашу профессию"
            }
        }
    };

    useEffect(() => {
        validate();
    }, [data]);

    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        api.users.update(userId, data).then(() =>
            api.users.getById(userId).then((data) => {
                setData((prevState) => (prevState = { data }));
                history.replace(`/users/${userId}`);
            })
        );
    };

    if (qualities && professions) {
        return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6 offset-md-3 shadow p-4">
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Имя"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                            <TextField
                                label="Электронная почта"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            <SelectField
                                label="Изменить профессию"
                                defaultOption={user.profession.name}
                                options={professions}
                                name="profession"
                                onChange={handleChange}
                                value={data.profession}
                                disabled={false}
                                error={errors.profession}
                            />
                            <RadioField
                                options={[
                                    { name: "Male", value: "male" },
                                    { name: "Female", value: "female" }
                                ]}
                                value={data.sex}
                                name="sex"
                                onChange={handleChange}
                                label="Изменить пол"
                            />
                            <MultiSelectField
                                options={qualities}
                                onChange={handleChange}
                                defaultValue={qualities}
                                name="qualities"
                                label="Изменить качества"
                            />
                            <button
                                className="btn btn-primary w-100 mx-auto"
                                type="submit"
                                disabled={!isValid}
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
    return <h1>Loading</h1>;
};

EditForm.propTypes = {
    user: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired
};

export default EditForm;

// {
// _id: "67rdca3eeb7f6fgeed471815",
// name: "Джон Дориан",
// email: "Jony7351@tw.com",
// sex: "male",
// profession: professions.doctor,
// qualities: [qualities.tedious, qualities.uncertain, qualities.strange],
// completedMeetings: 36,
// rate: 2.5,
// bookmark: false
// }
