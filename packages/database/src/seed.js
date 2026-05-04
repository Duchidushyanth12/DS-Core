import { prisma } from './index.js';
const domains = [
    { name: "Arrays", count: 2, description: "Fundamental data structure for storing elements sequentially." },
    { name: "Strings", count: 2, description: "Handling sequences of characters and string manipulation patterns." },
    { name: "Hashing", count: 2, description: "Efficient data retrieval and mapping using hash tables." },
    { name: "Sorting", count: 28, description: "Algorithms for arranging data in specific orders." },
    { name: "Searching", count: 28, description: "Binary search and other efficient data location techniques." },
    { name: "Two Pointers", count: 25, description: "Optimizing array/string traversals with two indices." },
    { name: "Sliding Window", count: 27, description: "Processing sub-arrays or sub-strings efficiently." },
    { name: "Stack", count: 20, description: "Last-In-First-Out data structures and their applications." },
    { name: "Queue", count: 28, description: "First-In-First-Out data structures and buffer management." },
    { name: "Linked List", count: 21, description: "Managing dynamic sequences of nodes." },
    { name: "Recursion", count: 22, description: "Solving complex problems by breaking them into simpler sub-problems." },
    { name: "Backtracking", count: 21, description: "Systematic search for solutions in a state space." },
    { name: "Trees", count: 22, description: "Hierarchical data structures and traversal patterns." },
    { name: "Binary Search Tree", count: 29, description: "Ordered tree structures for efficient operations." },
    { name: "Heap / Priority Queue", count: 21, description: "Efficiently managing elements based on priority." },
    { name: "Graphs", count: 27, description: "Representing and traversing complex relationships." },
    { name: "Dynamic Programming", count: 26, description: "Optimizing recursive solutions with memoization and tabulation." },
    { name: "Greedy Algorithms", count: 20, description: "Making locally optimal choices to find global solutions." },
    { name: "Bit Manipulation", count: 27, description: "Optimizing algorithms using bitwise operations." },
    { name: "Math", count: 24, description: "Mathematical patterns and number theory in coding." },
    { name: "Matrix", count: 22, description: "Solving problems involving 2D grids and matrices." },
    { name: "Trie", count: 27, description: "Prefix trees for efficient string prefix operations." },
    { name: "Union Find", count: 22, description: "Disjoint-set data structures for connectivity problems." },
    { name: "Segment Tree", count: 21, description: "Efficient range queries and updates on arrays." },
    { name: "System Design", count: 23, description: "Designing scalable and reliable software architectures." }
];
async function seed() {
    console.log('Starting seed for DSC Guided Platform...');
    for (const [index, domain] of domains.entries()) {
        const patternOrder = index + 1;
        const pattern = await prisma.pattern.upsert({
            where: { name: domain.name },
            update: {
                orderIndex: patternOrder,
                totalProblems: domain.count,
            },
            create: {
                name: domain.name,
                description: domain.description,
                difficulty: index < 8 ? "EASY" : index < 18 ? "MEDIUM" : "HARD",
                orderIndex: patternOrder,
                totalProblems: domain.count,
            },
        });
        console.log(`Seeding ${domain.count} problems for: ${pattern.name}`);
        for (let j = 1; j <= domain.count; j++) {
            const difficulty = j <= Math.ceil(domain.count * 0.3) ? "EASY" : j <= Math.ceil(domain.count * 0.7) ? "MEDIUM" : "HARD";
            const problemSlug = `${pattern.name.toLowerCase().replace(/ \/ /g, '-').replace(/ /g, '-')}-problem-${j}`;
            const problem = await prisma.problem.upsert({
                where: { slug: problemSlug },
                update: {
                    patternId: pattern.id
                },
                create: {
                    title: `${pattern.name} Challenge ${j}`,
                    slug: problemSlug,
                    description: `This is a comprehensive challenge in ${pattern.name}. Problem detail ${j} of ${domain.count} in this track.`,
                    difficulty,
                    timeLimit: 1000,
                    spaceLimit: 256,
                    patternId: pattern.id,
                },
            });
            // Ensure at least one test case exists
            const existingTestCase = await prisma.testCase.findFirst({
                where: { problemId: problem.id }
            });
            if (!existingTestCase) {
                await prisma.testCase.create({
                    data: {
                        problemId: problem.id,
                        input: "Sample Input",
                        expectedOutput: "Sample Output",
                        isHidden: false,
                    }
                });
            }
        }
    }
    console.log('Seeding completed successfully!');
}
seed()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map