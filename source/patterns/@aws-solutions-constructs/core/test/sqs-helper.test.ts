/**
 *  Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

// Imports
import { Stack } from "@aws-cdk/core";
import * as defaults from '../';
import { SynthUtils } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as sqs from '@aws-cdk/aws-sqs';

// --------------------------------------------------------------
// Test minimal deployment with no properties
// --------------------------------------------------------------
test('Test minimal deployment with no properties', () => {
    // Stack
    const stack = new Stack();
    // Helper declaration
    defaults.buildQueue(stack, 'primary-queue');
    // Assertion 1
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

// --------------------------------------------------------------
// Test deployment w/ custom properties
// --------------------------------------------------------------
test('Test deployment w/ custom properties', () => {
    // Stack
    const stack = new Stack();
    // Helper setup
    const encKey = defaults.buildEncryptionKey(stack);
    // Helper declaration
    defaults.buildQueue(stack, 'primary-queue', {
        queueProps: {
            description: "custom-queue-props",
            encryption: sqs.QueueEncryption.KMS,
            encryptionMasterKey: encKey
        }
    });
    // Assertion 1
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

// --------------------------------------------------------------
// Test dead letter queue deployment/configuration
// --------------------------------------------------------------
test('Test dead letter queue deployment/configuration', () => {
    // Stack
    const stack = new Stack();
    // Helper setup
    const encKey = defaults.buildEncryptionKey(stack);
    const dlq = defaults.buildQueue(stack, 'dead-letter-queue');
    const dlqi = defaults.buildDeadLetterQueue({
        deadLetterQueue: dlq,
        maxReceiveCount: 3
    });
    // Helper declaration
    defaults.buildQueue(stack, 'primary-queue', {
        queueProps: {
            description: "not-the-dead-letter-queue-props",
            encryption: sqs.QueueEncryption.KMS,
            encryptionMasterKey: encKey
        },
        deadLetterQueue: dlqi
    });
    // Assertion 1
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});