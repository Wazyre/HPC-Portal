import '@mantine/core/styles.css';

import { Card, createTheme, MantineProvider, virtualColor } from '@mantine/core';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import classes from './sourceStyle.module.css';

// The following theme controls the default css
const theme = createTheme({
	fontFamily: 'Comfortaa, cursive',
	// fontSizes: [],
	colors: {
		'ikarus-blue': ["#ebf6fe","#d6e9f8","#a8d1f4","#77b8f1","#53a2ef","#4095ee","#358fef","#2a7bd5","#1f6dbf","#055ca4"],
		'ikarus-grey': ["#f9fafb", "#e7e7e7", "#c9cccf", "#a9b1b8", "#8f99a5", "#7d8a99", "#738394", "#617181", "#556474", "#455768"],
		'backgroundColor': virtualColor({
			name: 'backgroundColor',
			light: 'ikarus-grey',
			dark: 'black'
		})
	},
	primaryColor: 'ikarus-blue',
	primaryShade: 8,
	components: {
		Card: Card.extend({
			classNames: {
				root: classes.card,
				section: classes.cardSection
			}
		})
	}
})

function App() {
	return (
    	<MantineProvider theme={theme}>
			<Notifications zIndex={1000}/> {/*Enables Notification system for the App*/}
    		<RouterProvider router={router}/>
    	</MantineProvider>
	)
}

export default App
