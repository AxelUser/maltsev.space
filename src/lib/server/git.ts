import { execSync } from 'child_process';

function getLastModified(file: string): string {
	const command = `git log -1 --pretty="format:%cI" ${file}`;
	const lastModified = execSync(command).toString().trim();
	return new Date(lastModified).toISOString().split('T')[0];
}

export { getLastModified };
