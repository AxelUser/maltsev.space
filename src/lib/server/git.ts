import { execSync } from 'child_process';

/** Date (YYYY-MM-DD) of the last commit touching `file`; today for files not committed yet. */
function getLastModified(file: string): string {
	const lastCommit = execSync(`git log -1 --pretty="format:%cI" -- "${file}"`).toString().trim();
	const date = lastCommit ? new Date(lastCommit) : new Date();
	return date.toISOString().split('T')[0];
}

export { getLastModified };
