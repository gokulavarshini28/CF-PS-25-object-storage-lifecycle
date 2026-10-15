# CF-PS-25: Object Storage Lifecycle Management

## Project Overview
This project demonstrates how to configure and verify lifecycle policies for cloud object storage using Amazon Web Services (AWS) S3.

The goal is to manage stored objects through prefix-based lifecycle rules and automatically expire eligible objects according to the configured retention period.

## Problem Statement
Apply and verify lifecycle policies for cloud object storage so test objects are transitioned or expired according to defined rules.

## Technologies Used
- Amazon Web Services (AWS)
- Amazon S3
- GitHub
- HTML, CSS, JavaScript (planned dashboard)

## AWS Configuration
- **Bucket Name:** `cfps25-lifecycle-demo-2026`
- **AWS Region:** Asia Pacific (Sydney) — `ap-southeast-2`
- **Encryption:** SSE-S3
- **Block Public Access:** Enabled
- **Versioning:** Disabled

## Test Objects
Five test objects were uploaded under the `archive/` prefix:
- `test1.txt`
- `test2.txt`
- `test3.txt`
- `test4.txt`
- `test5.txt`

An additional object, `regular-test.txt`, was uploaded under the `regular/` prefix to verify that unrelated objects are outside the lifecycle rule's scope.

## Lifecycle Policy
- **Rule Name:** `archive-lifecycle-rule`
- **Status:** Enabled
- **Filter Prefix:** `archive/`
- **Action:** Expire current objects after 30 days

## Verification Results
- The lifecycle rule is enabled and scoped to the `archive/` prefix.
- The archive test object details display the associated lifecycle rule and expiration date.
- The `regular/regular-test.txt` object does not display an expiration rule or expiration date.
- These checks confirm the configured rule scope. Actual deletion will be verified separately when it occurs.

## Lifecycle Timing
The configured expiration period is 30 days after object creation. Amazon S3 lifecycle processing is asynchronous, so actual removal may occur after the object becomes eligible for expiration.

**Expected expiration date:** Check the expiration date shown in the AWS S3 object details for the relevant object.

## Project Dashboard
A dashboard will be developed to present bucket information, lifecycle configuration, object prefixes, and verification results.

## Security Notes
- S3 Block Public Access is enabled.
- Server credentials and AWS secret access keys must never be committed to GitHub.
- Screenshots should be checked for sensitive account information before publication.

## Future Enhancements
- Interactive lifecycle monitoring dashboard
- Object status and prefix-scope visualization
- Verification evidence and reporting
- Additional lifecycle policies for different storage requirements

## Conclusion
This project demonstrates prefix-based lifecycle management in Amazon S3 and verifies that the configured policy applies to the intended test objects while excluding unrelated objects.
