import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { HeaderProps } from '../../type/Api';

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <AppBar position="fixed" color="primary" >
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, textAlign: 'center' }} // Added sx prop for centering
        >
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;