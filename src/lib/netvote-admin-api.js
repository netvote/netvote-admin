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


export default class NetVoteAdmin {
    constructor() {
        //Netvote API Server
        this.server = NETVOTE_API_SERVER + '/' + NETVOTE_API_VERSION;

        this.netvoteRequest = async (path, method, postObj) => {
            let URL = this.server + "/" + path;

            //Current authenticated user token
            let reqHeaders = new Headers();

            //Authorization based on AWS Cognito (Bearer Token)
            await Auth.currentSession()
                .then(data => {
                    //Add Authorization
                    let token = data.getIdToken().getJwtToken();
                    console.log(`NetVoteAdmin NOTICE: Adding JWToken Authorization to request: ${token}`);
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
                return await response.text();
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
            return this.netvoteRequest(NETVOTE_ELECTION_USAGE_DETAILS, 'GET', null);
        };

        this.getElectionUsageTimes = () => {
            return this.netvoteRequest(NETVOTE_ELECTION_USAGE_TIME, 'GET', null);
        };

    }

    get serverName() {
        return this.server;
    }
}
