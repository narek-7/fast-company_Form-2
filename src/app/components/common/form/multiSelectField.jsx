import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";

const MultiSelectField = ({ options, onChange, name, label, defaultValue }) => {
    const optionsArray = (options) => {
        if (!Array.isArray(options) && typeof options === "object") {
            return Object.keys(options).map((optionName) => ({
                label: options[optionName].name,
                value: options[optionName]._id
            }));
        } else {
            const remakedArray = [];
            options.forEach((qual) =>
                remakedArray.push({
                    label: qual.name,
                    value: qual._id
                })
            );
            return remakedArray;
        }
    };

    const handleChange = (value) => {
        onChange({ name: name, value });
    };

    return (
        <div className="mb-4">
            <label className="form-label">{label}</label>
            <Select
                isMulti
                closeMenuOnSelect={false}
                defaultValue={optionsArray(defaultValue)}
                options={optionsArray(options)}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleChange}
                name={name}
            />
        </div>
    );
};
MultiSelectField.propTypes = {
    options: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onChange: PropTypes.func,
    name: PropTypes.string,
    label: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default MultiSelectField;
