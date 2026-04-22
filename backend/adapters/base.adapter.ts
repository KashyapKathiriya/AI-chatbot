export interface AIAdapter {
    generate( input: {
        model: string,
        contents: any[];
    }): Promise<{
        text: string;
        modelVersion?: string;
    }>;
}