import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography, Menu, MenuItem } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// assets
// import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import PaymentIcon from '@mui/icons-material/Payment';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

import * as fsc from 'utils/freighter-stellar';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

// ==============================|| DASHBOARD - TOTAL INCOME LIGHT CARD ||============================== //

const TotalIncomeLightCard = ({ 
        isLoading, 
        funcBalance,
        funcBaseUrl,
        turretPublicKey, 
        account, 
        xdrToken, 
        setAssets, 
        setFuncBalance
    }) => {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const topUpOne = async () => {
        setAnchorEl(null);
        await buttonTopUp('1');
    };

    const topUpTwo = async () => {
        setAnchorEl(null);
        await buttonTopUp('5');

    };

    const topUpThree = async () => {
        setAnchorEl(null);
        await buttonTopUp('10');
    };

    const buttonTopUp = async (amt) => {
        const payXDR            = await fsc.payment(amt, turretPublicKey, account)
        await fsc.topUp(payXDR, funcBaseUrl, account);
        const assets            = await fsc.getAssets(account);
        const funcBalance       = await fsc.getFuncBalance(xdrToken, funcBaseUrl);
        assets.forEach((item, i) => {
            item.id = (i + 1).toString();
        });
        setAssets(assets);
        setFuncBalance(funcBalance);
    };

    return (
        <>
            {isLoading ? (
                <TotalIncomeCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2 }}>
                        <List sx={{ py: 0 }}>
                            <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                {/* <ListItemAvatar>
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            ...theme.typography.commonAvatar,
                                            ...theme.typography.largeAvatar,
                                            backgroundColor: theme.palette.warning.light,
                                            color: theme.palette.warning.dark
                                        }}
                                    >
                                        <StorefrontTwoToneIcon fontSize="inherit" />
                                    </Avatar>
                                </ListItemAvatar> */}
                                <ListItemText
                                    sx={{
                                        py: 0,
                                        mt: 0.45,
                                        mb: 0.45
                                    }}
                                    primary={<Typography variant="h4">{funcBalance} XLM</Typography>}
                                    secondary={
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                color: theme.palette.grey[500],
                                                mt: 0.5
                                            }}
                                        >
                                            Smart Contract Balance
                                        </Typography>
                                    }
                                />
                                {/* <ListItemAvatar onClick={buttonTopUp}>
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            ...theme.typography.commonAvatar,
                                            ...theme.typography.largeAvatar,
                                            backgroundColor: theme.palette.warning.dark,
                                            color: theme.palette.warning.light
                                        }}
                                    >
                                        <PaymentIcon fontSize="inherit" />
                                    </Avatar>
                                </ListItemAvatar> */}
                                <MoreHorizOutlinedIcon
                                    fontSize="small"
                                    sx={{
                                        color: theme.palette.primary[200],
                                        cursor: 'pointer'
                                    }}
                                    aria-controls="menu-popular-card"
                                    aria-haspopup="true"
                                    onClick={handleClick}
                                />
                                <Menu
                                    id="menu-total-income-card"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    variant="selectedMenu"
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right'
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right'
                                    }}
                                >
                                    <MenuItem onClick={topUpOne}> Top-Up 1 XLM</MenuItem>
                                    <MenuItem onClick={topUpTwo}> Top-Up 5 XLM</MenuItem>
                                    <MenuItem onClick={topUpThree}> Top-Up 10 XLM </MenuItem>
                                </Menu>
                            </ListItem>
                        </List>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

TotalIncomeLightCard.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalIncomeLightCard;
