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


const IncomingWebhook = require('@slack/client').IncomingWebhook;
const URL             = process.env.SLACK_WEBHOOK;


export const SlackMessage = ( messageData ) => {
	Log.verbose( `Sending slack message` );

	return new Promise( ( resolve, reject ) => {

		if( URL && URL.length > 0 ) {
			const Webhook = new IncomingWebhook( URL );

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
								'_Selected_: `' + messageData.components.length + '`\n' +
								'_Modules_: `' + messageData.components.join( '` , `') + '`\n\n\n',
							'short': false,
						},
						{
							'title': `Options`,
							'value': '' +
								'_JS Output_: `' + messageData.jsOutput + '`\n' +
								'_Style Output_: `' + messageData.styleOutput + '`\n\n\n',
							'short': false,
						},
						{
							'title': `Client`,
							'value': '' +
								'_IP_: `' + messageData.ip + '`',
							'short': false,
						}
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
	})
}
