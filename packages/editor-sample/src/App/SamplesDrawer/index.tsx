import React from 'react';

import { Divider, Drawer, Stack, Typography } from '@mui/material';

import { useSamplesDrawerOpen } from '../../documents/editor/EditorContext';

// import SidebarButton from './SidebarButton';
// import logo from './waypoint.svg';

export const SAMPLES_DRAWER_WIDTH = 240;

export default function SamplesDrawer() {
  const samplesDrawerOpen = useSamplesDrawerOpen();
  const message1 = '{name} = Users Name';
  const message2 = '{email} = Users Email';
  const message3 = '{phone} = Users Phone';
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={samplesDrawerOpen}
      sx={{
        width: samplesDrawerOpen ? SAMPLES_DRAWER_WIDTH : 0,
      }}
    >
      <Stack spacing={3} py={1} px={2} width={SAMPLES_DRAWER_WIDTH} justifyContent="space-between" height="100%" >
        <Stack spacing={2} sx={{ '& .MuiButtonBase-root': { width: '100%', justifyContent: 'flex-start' } }}>
          {/* {/* <Stack alignItems="flex-start"> */}
          
          <Typography  gutterBottom color={'red'} align='center' variant='h4'>
            Enter the following for dynamic values  
          </Typography>
          <Divider/>
          <Typography  gutterBottom align='center'>
            {message1}
          </Typography>
          <Divider/>
          <Typography  gutterBottom align='center'>
            {message2}{' '}
          </Typography>
          <Divider/>
          <Typography  gutterBottom align='center'>
            {message3}{' '}
          </Typography>

          {/* <SidebarButton href="#sample/EditTemplate">Edit Template</SidebarButton>
            <SidebarButton href="#sample/welcome">Welcome email</SidebarButton>
            <SidebarButton href="#sample/one-time-password">One-time passcode (OTP)</SidebarButton>
            <SidebarButton href="#sample/reset-password">Reset password</SidebarButton>
            <SidebarButton href="#sample/order-ecomerce">E-commerce receipt</SidebarButton>
            <SidebarButton href="#sample/subscription-receipt">Subscription receipt</SidebarButton>
            <SidebarButton href="#sample/reservation-reminder">Reservation reminder</SidebarButton>
            <SidebarButton href="#sample/post-metrics-report">Post metrics</SidebarButton>
            <SidebarButton href="#sample/respond-to-message">Respond to inquiry</SidebarButton> */}
        </Stack>

        {/* <Divider /> */}

        {/* <Stack>
            <Button size="small" href="https://www.usewaypoint.com/open-source/emailbuilderjs" target="_blank">
              Learn more
            </Button>
            <Button size="small" href="https://github.com/usewaypoint/email-builder-js" target="_blank">
              View on GitHub
            </Button>
          </Stack>
        </Stack>
        <Stack spacing={2} px={0.75} py={3}>
          <Link href="https://usewaypoint.com?utm_source=emailbuilderjs" target="_blank" sx={{ lineHeight: 1 }}>
            <Box component="img" src={logo} width={32} />
          </Link>
          <Box>
            <Typography variant="overline" gutterBottom>
              Looking for more?
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Waypoint is an email API service with a hosted &apos;pro&apos; template builder with Markdown, dynamic
              variables, loops, conditionals, drag and drop, layouts, and more.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ justifyContent: 'center' }}
            href="https://usewaypoint.com?utm_source=emailbuilderjs"
            target="_blank"
          >
            Learn more
        </Button>*/}
        {/* </Stack> */}
      </Stack>
    </Drawer>
  );
}
