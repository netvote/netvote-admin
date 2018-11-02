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

//Netvote API Details
const NETVOTE_API_SERVER = 'https://elections.netvote.io';
const NETVOTE_API_VERSION = 'v1';

//Netvote API Endpoints
const NETVOTE_ELECTION_USAGE_DETAILS = 'usage/detail';
const NETVOTE_ELECTION_USAGE_TIME = 'usage/report/time';

//Netvote IAM API Details
const IAM_API_SERVER = 'https://iam.netvote.io';
const IAM_API_VERSION = 'v1';

//Netvote IAM Endpoints
const IAM_ENDPOINT_API_KEY = "apikey";

export default class NetVoteAdmin {
    constructor() {
        //Netvote API Server
        this.electionsServer = NETVOTE_API_SERVER + '/' + NETVOTE_API_VERSION;
        this.iamServer = IAM_API_SERVER + '/' + IAM_API_VERSION;

        this.electionRequest = async (path, method, postObj) => {
            return this.netvoteRequest(this.electionsServer, path, method, postObj)
        }

        this.iamRequest = async (path, method, postObj) => {
            return this.netvoteRequest(this.iamServer, path, method, postObj)
        }

        this.netvoteRequest = async (endpoint, path, method, postObj) => {
            let URL = endpoint + "/" + path;

            //Current authenticated user token
            let reqHeaders = new Headers();

            //Authorization based on AWS Cognito (Bearer Token)
            await Auth.currentSession()
                .then(data => {
                    //Add Authorization
                    let token = data.getIdToken().getJwtToken();
                    reqHeaders.append('Authorization', "Bearer " + token);

                }).catch(err => {
                    console.log('NetVoteAdmin Auth ERROR: ' + err);
                });

            console.log('NetVoteAdmin Fetching URL: ' + URL);

            let response = await fetch(URL, {
                method,
                headers: reqHeaders,
                body: postObj
            });

            if (response.ok) {
                console.log('NetVoteAdmin Fetch Successful - ' + response.status);
                return await response.json()
            } else {
                console.log('NetVoteAdmin ERROR: Fetch Failed - ' + response.status);
                throw new Error('NetVoteAdmin ERROR: Fetch Failed - ' + response.status);
            }
        };

        this.get = (path) => {
            return this.netvoteRequest(path, 'GET', null);
        };

        this.post = (path, postObj) => {
            return this.netvoteRequest(path, 'POST', postObj);
        };

        this.delete = (path, postObj) => {
            return this.netvoteRequest(path, 'DELETE', postObj);
        };

        this.getElectionUsageDetails = () => {
            return this.electionRequest(NETVOTE_ELECTION_USAGE_DETAILS, 'GET', null);
        };

        this.getElectionUsageTimes = () => {
            return this.electionRequest(NETVOTE_ELECTION_USAGE_TIME, 'GET', null);
        };

        this.getApiKeys = () => {
            return this.iamRequest(IAM_ENDPOINT_API_KEY, 'GET', null);
        }

        this.getApiKey = (id) => {
            return this.iamRequest(`${IAM_ENDPOINT_API_KEY}/${id}`, 'GET', null);
        }

        this.addApiKey = () => {
            return this.iamRequest(IAM_ENDPOINT_API_KEY, 'POST', null);
        }

        this.deleteApiKey = (id) => {
            return this.iamRequest(`${IAM_ENDPOINT_API_KEY}/${id}`, 'DELETE', null);
        }
    }
}
