import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';

import * as fsc from 'utils/freighter-stellar';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    const [assets, setAssets] = useState([]);
    const [account, setAccount] = useState('');
    const [funcBalance, setFuncBalance] = useState('');
    const [xdrToken, setXDRToken] = useState('');
    const [flagsCaptured, setFlagsCaptured] = useState('');
    const turretPublicKey = 'GB4OYM7TQTJSROWXHOJLKAX2IJ2QN4I6S6GCJH4MGWVTAO5Q5DPNADXX';
    const funcBaseUrl = 'https://stellar-turrets-testnet.sdf-ecosystem.workers.dev/';
    const funcAddresses = ['9d64bd82134a1c141501dc16dca992446ecdc1812c1d75e8aab53443f879bf87'];
    useEffect(() => {
        const getData = async () => {
            const pk = localStorage.getItem("userPublicKey");
            const xdrToken = localStorage.getItem("xdrToken");
            const assets = await fsc.getAssets(pk);
            const funcBalance = await fsc.getFuncBalance(xdrToken, funcBaseUrl);
            return { pk, assets, xdrToken, funcBalance };
        };
        getData()
            .then((res) => {
                if (res.pk) {
                    console.log(res);
                    setAccount(res.pk);
                    setAssets(res.assets);
                    setXDRToken(res.xdrToken);
                    setFuncBalance(res.funcBalance);
                }
                setLoading(false);
            })
            .catch(console.error);
        setLoading(false);
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <EarningCard isLoading={isLoading} />
                    </Grid>
                    {/* <Grid item lg={4} md={6} sm={6} xs={12}>
                        <TotalOrderLineChartCard isLoading={isLoading} />
                    </Grid> */}
                    <Grid item lg={6} md={12} sm={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <TotalIncomeDarkCard isLoading={isLoading} flagsCaptured={flagsCaptured} />
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <TotalIncomeLightCard isLoading={isLoading} funcBalance={funcBalance} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={6}>
                        <PopularCard isLoading={isLoading} />
                        {/* <TotalGrowthBarChart isLoading={isLoading} /> */}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <PopularCard isLoading={isLoading} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
