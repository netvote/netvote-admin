/*
    Copyright (C) 2018

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { Auth } from 'aws-amplify';

//Citizen Data Billing API Details
const CITIZEN_DATA_BILLING_SERVER = 'https://billing.citizendata.network';
const CITIZEN_DATA_API_VERSION = 'v1';

//Citizen Data Services
const NETVOTE_SERVICE = 'netvote';
const NETROSA_SERVICE = 'netrosa';

//Citizen Data Usage Endpoints
const CITIZEN_DATA_USAGE_DETAILS = 'usage/detail';
const CITIZEN_DATA_USAGE_TIME = 'usage/report/time';

//Netvote API Details
const NETVOTE_API_SERVER = 'https://elections.netvote.io';
const NETVOTE_API_VERSION = 'dev';

//Netvote IAM API Details
const IAM_API_SERVER = 'https://iam.netvote.io';
const IAM_API_VERSION = 'v1';

//Netvote IAM Endpoints
const IAM_ENDPOINT_NETVOTE_API_KEY = "/netvote/apikey";
const IAM_ENDPOINT_TENANT = "tenant";

//Netrosa IAM Endpoints
const IAM_ENDPOINT_NETROSA_API_KEY = "/netrosa/apikey";


export default class NetVoteAdmin {
    constructor() {
        //API Servers
        this.citizenDataServer = CITIZEN_DATA_BILLING_SERVER + '/' + CITIZEN_DATA_API_VERSION;
        this.electionsServer = NETVOTE_API_SERVER + '/' + NETVOTE_API_VERSION;
        this.iamServer = IAM_API_SERVER + '/' + IAM_API_VERSION;

        this.billingRequest = async (path, service, method, postObj) => {
            let endpoint = (service) ? this.citizenDataServer + '/' + service : this.citizenDataServer;
            return this.networkRequest(endpoint, path, method, postObj)
        }

        this.electionRequest = async (path, method, postObj) => {
            return this.networkRequest(this.electionsServer, path, method, postObj)
        }

        this.iamRequest = async (path, method, postObj) => {
            return this.networkRequest(this.iamServer, path, method, postObj)
        }

        this.networkRequest = async (endpoint, path, method, postObj) => {
            let URL = endpoint + "/" + path;

            //Current authenticated user token
            let reqHeaders = new Headers();

            //Authorization based on AWS Cognito (Bearer Token)
            await Auth.currentSession()
                .then(data => {
                    //Add Authorization
                    let token = data.getIdToken().getJwtToken();
                    console.log('Admin Token: ' + token);
                    reqHeaders.append('Authorization', "Bearer " + token);

                }).catch(err => {
                    console.log('Admin Auth ERROR: ' + err);
                });

            console.log('Admin Fetching URL: ' + URL);

            let reqObj = {
                method,
                headers: reqHeaders
            }

            if(postObj) {
                reqObj.headers["Content-Type"] = "application/json";
                reqObj.body = JSON.stringify(postObj);
            }

            let response = await fetch(URL, reqObj);

            if (response.ok) {
                console.log('Admin Fetch Successful - ' + response.status);
                return await response.json();
            } else {
                console.log('Admin ERROR: Fetch Failed - ' + response.status);
                return await response.json();
                // throw new Error('Admin ERROR: Fetch Failed - ' + response.status);
            }
        };

        // ------------------------------------------------------------------------------------------------------------
        // Generic Endpoints
        // ------------------------------------------------------------------------------------------------------------
        this.get = (path) => {
            return this.networkRequest(path, 'GET', null);
        };

        this.post = (path, postObj) => {
            return this.networkRequest(path, 'POST', postObj);
        };

        this.delete = (path, postObj) => {
            return this.networkRequest(path, 'DELETE', postObj);
        };

        // ------------------------------------------------------------------------------------------------------------
        // Netvote Enpoints
        // ------------------------------------------------------------------------------------------------------------
        this.getNetvoteApiKeys = () => {
            return this.iamRequest(IAM_ENDPOINT_NETVOTE_API_KEY, 'GET', null);
        }

        this.getNetvoteApiKey = (id) => {
            return this.iamRequest(`${IAM_ENDPOINT_NETVOTE_API_KEY}/${id}`, 'GET', null);
        }

        this.addNetvoteApiKey = () => {
            return this.iamRequest(IAM_ENDPOINT_NETVOTE_API_KEY, 'POST', null);
        }

        this.deleteNetvoteApiKey = (id) => {
            return this.iamRequest(`${IAM_ENDPOINT_NETVOTE_API_KEY}/${id}`, 'DELETE', null);
        }

        this.getTentantInfo = () => {
            return this.iamRequest(IAM_ENDPOINT_TENANT, 'GET', null);
        }

        this.getElectionUsageDetails = () => {
            return this.billingRequest(CITIZEN_DATA_USAGE_DETAILS, NETVOTE_SERVICE, 'GET', null);
        };

        this.getElectionUsageTimes = (startTime, endTime) => {
            let formQuery = `${CITIZEN_DATA_USAGE_TIME}?start_dt=${startTime}&end_dt=${endTime}`;
            return this.billingRequest(formQuery, NETVOTE_SERVICE, 'GET', null);
        };

        this.setPaymentMethod = (stripeToken) => {
            return this.billingRequest("payment/method", null, 'PUT', {
                stripeToken: stripeToken
            })
        }

        // ------------------------------------------------------------------------------------------------------------
        // Netrosa Endpoints
        // ------------------------------------------------------------------------------------------------------------
        this.getNetrosaApiKeys = () => {
            return this.iamRequest(IAM_ENDPOINT_NETROSA_API_KEY, 'GET', null);
        }

        this.getNetrosaApiKey = (id) => {
            return this.iamRequest(`${IAM_ENDPOINT_NETROSA_API_KEY}/${id}`, 'GET', null);
        }

        this.addNetrosaApiKey = () => {
            return this.iamRequest(IAM_ENDPOINT_NETROSA_API_KEY, 'POST', null);
        }

        this.deleteNetrosaApiKey = (id) => {
            return this.iamRequest(`${IAM_ENDPOINT_NETROSA_API_KEY}/${id}`, 'DELETE', null);
        }

        this.getNetrosaUsageDetails = () => {
            return this.billingRequest(CITIZEN_DATA_USAGE_DETAILS, NETROSA_SERVICE, 'GET', null);
        };

        this.getNetrosaUsageTimes = (startTime, endTime) => {
            let formQuery = `${CITIZEN_DATA_USAGE_TIME}?start_dt=${startTime}&end_dt=${endTime}`;
            return this.billingRequest(formQuery, NETROSA_SERVICE, 'GET', null);
        };
    }
}
