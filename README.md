# campaign-monitor-cli

Campaign Monitor only provides [API](https://www.campaignmonitor.com/api/webhooks/) to manage webhook, so I made this simple CLI to make it easier to do this.

## How-To

Install CLI first
`npm i campaignmonitor-webook-cli -g`

You will ask to input apikey at the first time, and can use `campaignmonitor-webook-cli --type auth` to update token.

## Support Behavior

[Getting your clients](https://www.campaignmonitor.com/api/account/#getting_your_clients)  
`campaignmonitor-webook-cli -t get-client`

[Getting subscriber lists](https://www.campaignmonitor.com/api/clients/#subscriber_lists)  
`campaignmonitor-webook-cli -t get-list`

[List details](https://www.campaignmonitor.com/api/lists/#list_details)  
`campaignmonitor-webook-cli -t show-list-info`

[List webhooks](https://www.campaignmonitor.com/api/lists/#list_webhooks)  
`campaignmonitor-webook-cli -t get-list-webhook`

[Create a webhook](https://www.campaignmonitor.com/api/lists/#creating_a_webhook)  
`campaignmonitor-webook-cli -t create-list-webhook`

[Delete a webhook](https://www.campaignmonitor.com/api/lists/#deleting_a_webhook)  
`campaignmonitor-webook-cli -t delete-list-webhook`
