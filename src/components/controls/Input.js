import React from 'react'
import TextField from '@mui/material/TextField';

export default function Input(props) {

    const { name,size, label, value,error=null, onChange, ...other } = props;
    return (
        <TextField
            variant="outlined"
            label={label}
            name={name}
            value={value}
            size={size || "large"}
            onChange={onChange}
            {...other}
            {...(error && {error:true,helperText:error})}
        />
    )
}
