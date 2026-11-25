import { defineEnvVars } from '@sveltejs/kit/env';

const optional = (value: string | undefined) => value ?? '';

export const variables = defineEnvVars({
	POSTHOG_ANALYTICS_PROJECT_ID: { static: true, schema: optional },
	POSTHOG_ANALYTICS_API_KEY: { static: true, schema: optional },
	PUBLIC_POSTHOG_API_KEY: { public: true, static: true, schema: optional },
	PUBLIC_POSTHOG_HOST: { public: true, static: true, schema: optional }
});
