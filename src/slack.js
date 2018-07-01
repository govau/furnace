/***************************************************************************************************************************************************************
 *
 * Slack
 *
 * SlackMessage
 *
 **************************************************************************************************************************************************************/

'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Settings }           from './settings';
import { Log }                from './helper';

const envVars = process.env.VCAP_SERVICES ? JSON.parse( process.env.VCAP_SERVICES ) : {};
const IncomingWebhook = require('@slack/client').IncomingWebhook;


export const SendMessage = ( data, URL, isPrivate = true ) => {
	Log.verbose( `Sending slack message to ${ URL }` );

	return new Promise( ( resolve, reject ) => {

		if( URL && URL.length > 0 ) {
			const Webhook = new IncomingWebhook( URL );

			const clientInfo = isPrivate
				? {}
				: {
						'title': `Client`,
						'value': '' +
							'_IP_: `' + data.ip + '`',
						'short': false,
					};

			const message = {
				text: `*Furnace*:\n\n`,
				attachments: [{
					'fallback': `_Inspect the GOLD nuggets?_`,
					'pretext': `_Inspect the GOLD nuggets?_`,
					'color': `#ff4500`,
					'mrkdwn_in': [
						`text`,
						`pretext`,
						`fields`,
					],
					'fields': [
						{
							'title': `Components`,
							'value': '' +
								'_Selected_: `' + data.components.length + '`\n' +
								'_Modules_: `' + data.components.join( '` , `') + '`\n\n\n',
							'short': false,
						},
						{
							'title': `Options`,
							'value': '' +
								'_JS Output_: `' + data.jsOutput + '`\n' +
								'_Style Output_: `' + data.styleOutput + '`\n\n\n',
							'short': false,
						},
						clientInfo,
					],
					'footer': `:gold:`,
				}]
			}

			Webhook.send( message, ( error, header, statusCode, body ) => {
				if( error ) {
					reject( error );
				}
				else {
					Log.verbose(`Slack received: ${ statusCode }`);
					Log.verbose(`Slack message sent:\n ${ message }`);
					resolve();
				}
			});
		}
		else {
			Log.message( `Failed to send slack message, SLACK_WEBHOOK (${ URL }) environment variable not found.` );
			resolve();
		}
	});
};


export const SlackMessage = ( messageData ) => {
	const CHANNELS = envVars['user-provided'] ? envVars['user-provided'][ 0 ].credentials.SLACK_WEBHOOKS : [];
	const allMessages = [];

	return new Promise( ( resolve, reject ) => {

		CHANNELS.forEach( CHANNEL => allMessages.push( SendMessage = ( messageData, CHANNEL.URL, CHANNEL.isPrivate ) ) );

		Promise.all( allMessages )
			.catch( error => reject(error) )
			.then( resolve );
	});
}
