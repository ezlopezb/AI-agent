import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Alert,
  Paper
} from '@mui/material';
import { updateSabreCredentials } from '../services/UYWSApi';

interface ProviderSetupScreenProps {
  open: boolean;
  onComplete: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`provider-tabpanel-${index}`}
      aria-labelledby={`provider-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const ProviderSetupScreen: React.FC<ProviderSetupScreenProps> = ({ open, onComplete }) => {
  const [tabValue, setTabValue] = useState(0);
  const [sabreCredentials, setSabreCredentials] = useState({
    pcc: '',
    epr: '',
    pass: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event)
    setTabValue(newValue);
  };

  const handleSabreSetup = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await updateSabreCredentials(sabreCredentials);
      onComplete();
    } catch (err) {
      setError('Failed to set up Sabre credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    outline: 'none'
  };

  return (
    <Modal
      open={open}
      aria-labelledby="provider-setup-modal"
      aria-describedby="provider-setup-description"
    >
      <Box sx={modalStyle}>
        <Paper elevation={0}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Provider Setup Required
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Please configure your provider credentials to continue
            </Typography>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Sabre" />
              <Tab label="Amadeus" disabled />
              <Tab label="Travelport" disabled />
              <Tab label="Civitatis" disabled />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              Sabre Configuration
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Please enter your Sabre <b>CERT</b> credentials. These are required for accessing Sabre services.
            </Alert>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="PCC"
                variant="outlined"
                fullWidth
                value={sabreCredentials.pcc}
                onChange={(e) => setSabreCredentials(prev => ({ ...prev, pcc: e.target.value }))}
                required
              />
              <TextField
                label="EPR"
                variant="outlined"
                fullWidth
                value={sabreCredentials.epr}
                onChange={(e) => setSabreCredentials(prev => ({ ...prev, epr: e.target.value }))}
                required
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={sabreCredentials.pass}
                onChange={(e) => setSabreCredentials(prev => ({ ...prev, pass: e.target.value }))}
                required
              />
              <Button
                variant="contained"
                onClick={handleSabreSetup}
                disabled={!sabreCredentials.pcc || !sabreCredentials.epr || !sabreCredentials.pass || isLoading}
                sx={{
                  mt: 2,
                  backgroundColor: '#ea1e21',
                  '&:hover': {
                    backgroundColor: '#d01419'
                  }
                }}
              >
                {isLoading ? 'Setting up...' : 'Set up'}
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="body1">Amadeus configuration coming soon...</Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="body1">Travelport configuration coming soon...</Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="body1">Civitatis configuration coming soon...</Typography>
          </TabPanel>
        </Paper>
      </Box>
    </Modal>
  );
};