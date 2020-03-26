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

import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import { Construct } from '@aws-cdk/core';
import * as defaults from '@aws-solutions-konstruk/core';

/**
 * @summary The properties for the CloudFrontToS3 Construct
 */
export interface CloudFrontToS3Props {
  /**
   * Whether to create a S3 Bucket or use an existing S3 Bucket.
   * If set to false, you must provide S3 Bucket as `existingBucketObj`
   *
   * @default - true
   */
  readonly deployBucket?: boolean,
  /**
   * Existing instance of S3 Bucket object.
   * If `deployBucket` is set to false only then this property is required
   *
   * @default - None
   */
  readonly existingBucketObj?: s3.Bucket,
  /**
   * Optional user provided props to override the default props.
   * If `deploy` is set to true only then this property is required
   *
   * @default - Default props are used
   */
  readonly bucketProps?: s3.BucketProps,
  /**
   * Optional user provided props to override the default props
   *
   * @default - Default props are used
   */
  readonly cloudFrontDistributionProps?: cloudfront.CloudFrontWebDistributionProps;
}

export class CloudFrontToS3 extends Construct {
    private cloudfront: cloudfront.CloudFrontWebDistribution;
    private s3Bucket: s3.Bucket;

  /**
   * @summary Constructs a new instance of the CloudFrontToS3 class.
   * @param {cdk.App} scope - represents the scope for all the resources.
   * @param {string} id - this is a a scope-unique id.
   * @param {CloudFrontToS3Props} props - user provided props for the construct
   * @since 0.8.0
   * @access public
   */
    constructor(scope: Construct, id: string, props: CloudFrontToS3Props) {
        super(scope, id);

        this.s3Bucket = defaults.buildS3Bucket(this, {
            deployBucket: props.deployBucket,
            existingBucketObj: props.existingBucketObj,
            bucketProps: props.bucketProps
        });

        this.cloudfront = defaults.CloudFrontDistributionForS3(this, this.s3Bucket, props.cloudFrontDistributionProps);
    }

    /**
     * @summary Retruns an instance of cloudfront.CloudFrontWebDistribution created by the construct
     * @returns {cloudfront.CloudFrontWebDistribution} Instance of CloudFrontWebDistribution created by the construct
     * @since 0.8.0
     * @access public
     */
    public cloudFrontWebDistribution(): cloudfront.CloudFrontWebDistribution {
        return this.cloudfront;
    }

    /**
     * @summary Retruns an instance of s3.Bucket created by the construct.
     * @returns {s3.Bucket} Instance of Bucket created by the construct
     * @since 0.8.0
     * @access public
     */
    public bucket(): s3.Bucket {
        return this.s3Bucket;
    }
}