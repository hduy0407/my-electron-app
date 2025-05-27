import { styled } from "styled-components";
import { Button } from "@mui/material";

const ButtonStyle = styled(Button)`
    background-color: #3CA2F0;
    &:hover {
        background-color: #2288D7;
    }
    box-shadow: none;
    align-self: center;
    border-radius: 15px;
`

export default ButtonStyle;


