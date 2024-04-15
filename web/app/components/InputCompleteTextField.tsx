import { OutlinedInputProps, TextField, TextFieldProps, styled } from "@mui/material";

const InputCompleteTextField = styled((props: TextFieldProps) => (
    <TextField
        InputProps={{ disableUnderline: true } as Partial<OutlinedInputProps>}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiAutocomplete-input': {
        width: 'auto !important',
        fontSize: theme.typography.fontSize,
    },
}));

export default InputCompleteTextField;

