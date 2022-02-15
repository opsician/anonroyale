import PropTypes from 'prop-types';
import React from "react";

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';

// assets
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

const Asset = ({ast, balance}) => { 
    const theme = useTheme();

    return(
        <Grid container direction="column">
            <Grid item>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                            {ast}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="subtitle1" color="inherit">
                                    {balance}
                                </Typography>
                            </Grid>
                            {/* <Grid item>
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: '5px',
                                        backgroundColor: theme.palette.orange.light,
                                        color: theme.palette.orange.dark,
                                        marginLeft: 1.875
                                    }}
                                >
                                </Avatar>
                            </Grid> */}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        // <Divider sx={{ my: 1.5 }} />
    );
}

export default Asset;