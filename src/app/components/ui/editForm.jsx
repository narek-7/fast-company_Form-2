import React, { useEffect, useState } from "react";
import MultiSelectField from "../common/form/multiSelectField";
import SelectField from "../common/form/selectField";
import RadioField from "../common/form/radioField";
import { validator } from "../../utils/validator";
import TextField from "../common/form/textField";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import api from "../../api";

const EditForm = ({ userId }) => {
    const [data, setData] = useState({});
    const [qualities, setQualities] = useState({});
    const [professions, setProfession] = useState();
    const [errors, setErrors] = useState({});
    const history = useHistory();

    useEffect(() => {
        api.users.getById(userId).then((data) => setData(data));
        api.professions.fetchAll().then((data) => setProfession(data));
        api.qualities.fetchAll().then((data) => setQualities(data));
    }, []);

    const isValid = Object.keys(errors).length === 0;

    const handleChange = (target) => {
        console.log("target", target);
        if (target.name === "profession") {
            const prof = Object.keys(professions).find(
                (profession) => professions[profession]._id === target.value
            );
            setData((prevState) => ({
                ...prevState,
                [target.name]: professions[prof]
            }));
        } else if (target.name === "qualities") {
            const activeUserQualArray = [];
            target.value.forEach((qualId) =>
                activeUserQualArray.push(qualId.value)
            );
            const qualitiesArray = Object.values(qualities).filter((qual) =>
                activeUserQualArray.includes(qual._id)
            );
            setData((prevState) => ({
                ...prevState,
                [target.name]: qualitiesArray
            }));
        } else {
            setData((prevState) => ({
                ...prevState,
                [target.name]: target.value
            }));
        }
    };

    const validatorConfig = {
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            }
        },
        name: {
            isRequired: {
                message: "Имя обязателен для заполнения"
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
        if (isValid) {
            api.users.update(userId, data).then((data) => {
                if (data) {
                    history.replace(`/users/${data._id}`);
                }
            });
        }
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
                                defaultOption={data.profession.name}
                                options={professions}
                                name="profession"
                                onChange={handleChange}
                                value={data.profession._id}
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
                                defaultValue={data.qualities}
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
