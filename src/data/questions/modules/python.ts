import { distributeQuestions } from '../../questionFactory'
import type { QuestionInput } from '../../questionFactory'

const module = 'python'

export const pythonQuestions = distributeQuestions(
  module,
  [
    {
      sheet: 'python-basics',
      category: 'Python Basics',
      items: [
        {
          title: 'Mutable vs immutable types',
          difficulty: 'Easy',
          question: 'Which Python types are mutable and which are immutable? Why does it matter?',
          answer:
            'Immutable: int, float, str, tuple, frozenset, bytes. Mutable: list, dict, set, bytearray. Immutables cannot change in place—operations create new objects. This affects default arguments, dict keys (must be hashable/immutable), and thread safety. Lists passed to functions can be modified in place; strings cannot.',
          tags: ['fundamentals', 'types'],
          frequency: 'Very High',
        },
        {
          title: 'List vs tuple',
          difficulty: 'Easy',
          question: 'When would you use a tuple instead of a list?',
          answer:
            'Use tuples for fixed-size records, dictionary keys, return values with named structure, and data that should not change. Tuples are slightly more memory-efficient and hashable when all elements are hashable. Lists are for homogeneous collections that grow or shrink.',
          tags: ['collections', 'fundamentals'],
          frequency: 'Very High',
        },
        {
          title: 'List comprehensions',
          difficulty: 'Easy',
          question: 'Rewrite a loop that squares even numbers from 0–9 using a list comprehension.',
          answer:
            'List comprehensions are concise, often faster than explicit loops, and support optional filters. Avoid nesting too deeply—readability suffers. Generator expressions use () for lazy evaluation.',
          example: 'squares = [x**2 for x in range(10) if x % 2 == 0]',
          tags: ['comprehensions', 'fundamentals'],
          frequency: 'Very High',
        },
        {
          title: 'is vs ==',
          difficulty: 'Easy',
          question: 'What is the difference between is and == in Python?',
          answer:
            '== compares value equality (__eq__). is compares object identity (same memory address). Use is only for singletons like None, True, False. Small integers (-5 to 256) may be interned—never rely on is for value comparison.',
          tags: ['operators', 'fundamentals'],
          frequency: 'High',
        },
      ] satisfies QuestionInput[],
    },
    {
      sheet: 'python-oop',
      category: 'OOP',
      items: [
        {
          title: 'Class vs instance attributes',
          difficulty: 'Medium',
          question: 'Explain the difference between class attributes and instance attributes.',
          answer:
            'Class attributes are shared across all instances (defined on the class body). Instance attributes belong to each object (typically set in __init__). Mutating a mutable class attribute affects all instances unless shadowed on an instance. Prefer instance attributes for per-object state.',
          tags: ['oop', 'classes'],
          frequency: 'Very High',
        },
        {
          title: 'Inheritance and MRO',
          difficulty: 'Medium',
          question: 'How does Python resolve method lookup in multiple inheritance?',
          answer:
            'Python uses C3 linearization to compute Method Resolution Order (MRO). super() follows MRO, not just the parent class. Diamond inheritance is handled predictably. Inspect with ClassName.__mro__ or ClassName.mro().',
          tags: ['oop', 'inheritance'],
          frequency: 'High',
        },
        {
          title: 'Dunder methods',
          difficulty: 'Medium',
          question: 'What are dunder methods? Give examples used in data engineering code.',
          answer:
            'Dunder (double underscore) methods customize object behavior: __init__, __repr__, __str__, __len__, __iter__, __enter__/__exit__ (context managers), __call__. __repr__ should be unambiguous for debugging; __str__ is user-friendly. Implement __iter__ to make objects iterable in pipelines.',
          tags: ['oop', 'magic-methods'],
          frequency: 'High',
        },
        {
          title: '@classmethod vs @staticmethod',
          difficulty: 'Medium',
          question: 'When do you use classmethod, staticmethod, and instance methods?',
          answer:
            'Instance methods receive self and access instance state. @classmethod receives cls—use for alternative constructors (from_dict, from_json). @staticmethod receives neither—use for utility functions logically grouped with the class. Classmethods support inheritance; staticmethods do not need class context.',
          tags: ['oop', 'decorators'],
          frequency: 'High',
        },
      ] satisfies QuestionInput[],
    },
    {
      sheet: 'python-functions',
      category: 'Functions',
      items: [
        {
          title: '*args and **kwargs',
          difficulty: 'Easy',
          question: 'Explain *args and **kwargs with a practical example.',
          answer:
            '*args collects extra positional arguments as a tuple; **kwargs collects extra keyword arguments as a dict. Use for wrappers, decorators, and flexible APIs. Order: positional, *args, keyword-only, **kwargs.',
          example: 'def log_call(fn, *args, **kwargs):\n    print(args, kwargs)\n    return fn(*args, **kwargs)',
          tags: ['functions', 'fundamentals'],
          frequency: 'Very High',
        },
        {
          title: 'Default argument gotcha',
          difficulty: 'Medium',
          question: 'Why should you avoid mutable default arguments like def f(x=[]):?',
          answer:
            'Default values are evaluated once at function definition time, not per call. A mutable default is shared across calls—appends persist. Use None as default and create a new list inside the function: if x is None: x = [].',
          tags: ['functions', 'gotchas'],
          frequency: 'Very High',
        },
        {
          title: 'Lambda vs def',
          difficulty: 'Easy',
          question: 'When is a lambda appropriate versus a named function?',
          answer:
            'Lambdas are anonymous single-expression functions—good for short callbacks (sorted(key=...), map/filter). Use def for anything multi-line, documented, or reused. Lambdas cannot contain statements or annotations.',
          tags: ['functions', 'lambda'],
          frequency: 'High',
        },
        {
          title: 'Closures and nonlocal',
          difficulty: 'Medium',
          question: 'What is a closure? How does nonlocal differ from global?',
          answer:
            'A closure captures variables from an enclosing scope when the inner function outlives the outer call. nonlocal binds to the nearest enclosing scope (excluding globals); global binds module-level names. Useful for factory functions and decorators with state.',
          tags: ['functions', 'scope'],
          frequency: 'Medium',
        },
      ] satisfies QuestionInput[],
    },
    {
      sheet: 'python-collections',
      category: 'Collections',
      items: [
        {
          title: 'dict get vs direct access',
          difficulty: 'Easy',
          question: 'When do you use dict.get() instead of dict[key]?',
          answer:
            'dict[key] raises KeyError if missing. get(key, default) returns default without exception—ideal for optional fields in ETL records. setdefault inserts if missing. For existence checks without retrieval, use "key in d".',
          tags: ['dict', 'collections'],
          frequency: 'Very High',
        },
        {
          title: 'Counter and defaultdict',
          difficulty: 'Medium',
          question: 'How do Counter and defaultdict simplify data processing?',
          answer:
            'Counter counts hashable elements—most_common() for top-N frequencies. defaultdict(factory) auto-creates missing keys (list, int, set defaults). Both reduce boilerplate in aggregation and grouping pipelines compared to manual key checks.',
          example: 'from collections import Counter, defaultdict\ncounts = Counter(rows)\ngroups = defaultdict(list)',
          tags: ['collections', 'stdlib'],
          frequency: 'High',
        },
        {
          title: 'Set operations',
          difficulty: 'Easy',
          question: 'How do you find duplicates or unique elements across two lists efficiently?',
          answer:
            'Convert to sets for O(n) membership and set operations: union |, intersection &, difference -, symmetric_difference ^. Sets require hashable elements. For preserving order while deduplicating, use dict.fromkeys(seq) (Python 3.7+).',
          tags: ['set', 'collections'],
          frequency: 'High',
        },
        {
          title: 'Ordered data structures',
          difficulty: 'Medium',
          question: 'Does Python preserve dict insertion order? What about OrderedDict?',
          answer:
            'Since Python 3.7, dict preserves insertion order as a language guarantee. collections.OrderedDict still useful for move_to_end(), popitem(last=False), and equality that considers order. For LRU caches, OrderedDict or functools.lru_cache.',
          tags: ['dict', 'collections'],
          frequency: 'Medium',
        },
      ] satisfies QuestionInput[],
    },
    {
      sheet: 'python-files',
      category: 'File Handling',
      items: [
        {
          title: 'Context managers for files',
          difficulty: 'Easy',
          question: 'Why use with open(...) as f instead of open/close manually?',
          answer:
            'Context managers guarantee cleanup even on exceptions—files are closed reliably. with delegates to __enter__/__exit__. Always specify encoding="utf-8" for text files in production to avoid platform defaults.',
          example: 'with open("data.csv", encoding="utf-8") as f:\n    for line in f:\n        process(line)',
          tags: ['files', 'context-manager'],
          frequency: 'Very High',
        },
        {
          title: 'pathlib vs os.path',
          difficulty: 'Medium',
          question: 'Why prefer pathlib over os.path for file paths?',
          answer:
            'pathlib.Path is object-oriented, cross-platform, and composable (/ operator, .glob(), .read_text()). Cleaner than os.path.join chains. Use Path for new code; os.path remains common in legacy scripts.',
          example: 'from pathlib import Path\nfor p in Path("data").glob("*.json"):\n    print(p.read_text(encoding="utf-8"))',
          tags: ['files', 'pathlib'],
          frequency: 'High',
        },
        {
          title: 'Reading large files',
          difficulty: 'Medium',
          question: 'How do you process a 50 GB log file without loading it all into memory?',
          answer:
            'Iterate line-by-line with for line in f, use generators to pipeline transforms, chunk reads with read(size), or memory-map for random access. For CSV/JSONL, stream records. Consider pandas read_csv(chunksize=) for structured data.',
          tags: ['files', 'performance'],
          frequency: 'High',
        },
      ] satisfies QuestionInput[],
    },
    {
      sheet: 'python-exceptions',
      category: 'Exception Handling',
      items: [
        {
          title: 'try/except/else/finally',
          difficulty: 'Easy',
          question: 'Explain the roles of else and finally in try/except blocks.',
          answer:
            'try runs guarded code. except handles matching exceptions. else runs if no exception occurred (keeps happy path out of try). finally always runs—for cleanup (close connections). Catch specific exceptions, not bare except. Re-raise with raise to preserve stack trace.',
          tags: ['exceptions', 'fundamentals'],
          frequency: 'Very High',
        },
        {
          title: 'Custom exceptions',
          difficulty: 'Medium',
          question: 'When and how do you define custom exception classes?',
          answer:
            'Create domain-specific errors inheriting from Exception (or ValueError, RuntimeError). Add attributes for context (row number, API status). Enables selective handling and clearer API contracts. Keep hierarchies shallow—one base like PipelineError with subclasses.',
          example: 'class ValidationError(Exception):\n    def __init__(self, field, value):\n        self.field = field\n        super().__init__(f"Invalid {field}: {value}")',
          tags: ['exceptions', 'design'],
          frequency: 'High',
        },
        {
          title: 'EAFP vs LBYL',
          difficulty: 'Medium',
          question: 'What is EAFP and how does it compare to LBYL?',
          answer:
            'EAFP (Easier to Ask Forgiveness than Permission): try operation, catch exception. LBYL (Look Before You Leap): check conditions first. Python culture favors EAFP when exceptions are rare—it avoids race conditions and double lookups. Use LBYL for expensive checks or user input validation.',
          tags: ['exceptions', 'idioms'],
          frequency: 'Medium',
        },
      ] satisfies QuestionInput[],
    },
    {
      sheet: 'python-generators',
      category: 'Iterators & Generators',
      items: [
        {
          title: 'yield vs return',
          difficulty: 'Medium',
          question: 'What does yield do? How is a generator different from returning a list?',
          answer:
            'yield pauses the function and produces a value; calling next() resumes. Generators are lazy—one item at a time, constant memory. Returning a list materializes everything. Use generators for streaming ETL, infinite sequences, and pipeline stages.',
          example: 'def read_batches(path, size=1000):\n    batch = []\n    for line in open(path):\n        batch.append(line)\n        if len(batch) == size:\n            yield batch\n            batch = []',
          tags: ['generators', 'iterators'],
          frequency: 'Very High',
        },
        {
          title: 'Iterator protocol',
          difficulty: 'Medium',
          question: 'What methods must an object implement to be iterable?',
          answer:
            'Iterable: __iter__ returns an iterator. Iterator: __iter__ returns self, __next__ returns next item or raises StopIteration. for loops call iter() then next() until StopIteration. Generators automatically implement the protocol.',
          tags: ['iterators', 'protocol'],
          frequency: 'High',
        },
        {
          title: 'Generator expressions',
          difficulty: 'Easy',
          question: 'When use a generator expression instead of a list comprehension?',
          answer:
            'Generator expressions (x for x in iterable) are lazy—no full list in memory. Use when consuming once (sum, any, next, for loop). List comprehensions when you need len, indexing, or multiple passes.',
          example: 'total = sum(x**2 for x in range(10_000_000))',
          tags: ['generators', 'comprehensions'],
          frequency: 'High',
        },
        {
          title: 'itertools for pipelines',
          difficulty: 'Medium',
          question: 'Name itertools functions useful in data processing.',
          answer:
            'chain flattens iterables; groupby groups consecutive equal keys (sort first!); islice slices iterators; tee duplicates iterators; batched (3.12+) chunks items. Prefer itertools over manual loops for clarity and C-speed primitives.',
          tags: ['itertools', 'stdlib'],
          frequency: 'Medium',
        },
      ] satisfies QuestionInput[],
    },
    {
      sheet: 'python-decorators',
      category: 'Decorators',
      items: [
        {
          title: 'How decorators work',
          difficulty: 'Medium',
          question: 'Explain how @decorator syntax works under the hood.',
          answer:
            '@decorator above def f is syntactic sugar for f = decorator(f). Decorators are callables accepting a function and returning a (usually wrapped) function. Used for logging, timing, retries, auth, and memoization.',
          example: 'def timer(fn):\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = fn(*args, **kwargs)\n        print(time.perf_counter() - start)\n        return result\n    return wrapper',
          tags: ['decorators', 'functions'],
          frequency: 'Very High',
        },
        {
          title: 'functools.wraps',
          difficulty: 'Medium',
          question: 'Why use @functools.wraps in decorator implementations?',
          answer:
            'Bare wrappers replace __name__, __doc__, and __module__ of the original function—breaks introspection, debugging, and functools.lru_cache on decorated functions. @wraps(fn) copies metadata to the wrapper. Always use it in production decorators.',
          tags: ['decorators', 'functools'],
          frequency: 'High',
        },
        {
          title: 'Parameterized decorators',
          difficulty: 'Hard',
          question: 'How do you write a decorator that accepts arguments, e.g. @retry(times=3)?',
          answer:
            'Outer function receives decorator args and returns the actual decorator. Three levels: args wrapper → decorator → wrapper. functools.partial can simplify fixed-arg cases.',
          example: 'def retry(times=3):\n    def decorator(fn):\n        def wrapper(*args, **kwargs):\n            for attempt in range(times):\n                try:\n                    return fn(*args, **kwargs)\n                except Exception:\n                    if attempt == times - 1:\n                        raise\n        return wrapper\n    return decorator',
          tags: ['decorators', 'advanced'],
          frequency: 'Medium',
        },
      ] satisfies QuestionInput[],
    },
    {
      sheet: 'python-threading',
      category: 'Multithreading',
      items: [
        {
          title: 'GIL explained',
          difficulty: 'Medium',
          question: 'What is the Global Interpreter Lock (GIL) and how does it affect threading?',
          answer:
            'The GIL allows only one thread to execute Python bytecode at a time in CPython. Threads help I/O-bound work (network, disk)—threads release GIL during I/O. CPU-bound parallelism needs multiprocessing or native extensions (NumPy releases GIL during C ops).',
          tags: ['threading', 'gil', 'concurrency'],
          frequency: 'Very High',
        },
        {
          title: 'Thread vs asyncio for I/O',
          difficulty: 'Medium',
          question: 'When choose threading versus asyncio for concurrent I/O?',
          answer:
            'Threading: blocking libraries, simpler mental model, moderate concurrency. asyncio: single-threaded event loop, great for thousands of concurrent connections, requires async-compatible libraries. For requests-heavy ETL, ThreadPoolExecutor is often pragmatic; for web sockets/HTTP2, asyncio.',
          tags: ['threading', 'asyncio'],
          frequency: 'High',
        },
        {
          title: 'Locks and thread safety',
          difficulty: 'Medium',
          question: 'How do you protect shared mutable state across threads?',
          answer:
            'Use threading.Lock, RLock (reentrant), or higher-level Queue for producer-consumer. Minimize shared state—prefer immutable data or thread-local storage. concurrent.futures.ThreadPoolExecutor manages pools; submit tasks and gather futures.',
          tags: ['threading', 'locks'],
          frequency: 'High',
        },
      ] satisfies QuestionInput[],
    },
    {
      sheet: 'python-multiprocessing',
      category: 'Multiprocessing',
      items: [
        {
          title: 'Process vs thread',
          difficulty: 'Medium',
          question: 'When use multiprocessing instead of multithreading in Python?',
          answer:
            'Multiprocessing bypasses the GIL with separate memory spaces—ideal for CPU-bound tasks (parsing, transforms, ML preprocessing). Cost: higher memory, pickling overhead for IPC. threading for I/O-bound; multiprocessing for CPU-bound.',
          tags: ['multiprocessing', 'concurrency'],
          frequency: 'Very High',
        },
        {
          title: 'Pool and ProcessPoolExecutor',
          difficulty: 'Medium',
          question: 'How do you parallelize a function over a list of inputs?',
          answer:
            'Use concurrent.futures.ProcessPoolExecutor with map or submit. multiprocessing.Pool is lower-level equivalent. Guard entry with if __name__ == "__main__" on Windows spawn. Chunk size tuning balances overhead vs utilization.',
          example: 'from concurrent.futures import ProcessPoolExecutor\nwith ProcessPoolExecutor() as pool:\n    results = list(pool.map(transform, items))',
          tags: ['multiprocessing', 'executor'],
          frequency: 'High',
        },
        {
          title: 'Pickling and spawn',
          difficulty: 'Hard',
          question: 'Why do multiprocessing errors mention pickling or spawn?',
          answer:
            'Child processes start fresh (spawn on Windows/macOS default). Target functions and args must be picklable and importable at module top level—lambdas and nested functions often fail. Use initializer for shared read-only setup; Manager/Queue for shared mutable state.',
          tags: ['multiprocessing', 'pickle'],
          frequency: 'Medium',
        },
      ] satisfies QuestionInput[],
    },
    {
      sheet: 'python-logging',
      category: 'Logging',
      items: [
        {
          title: 'logging levels',
          difficulty: 'Easy',
          question: 'Explain DEBUG, INFO, WARNING, ERROR, CRITICAL and when to use each.',
          answer:
            'DEBUG: diagnostic detail for dev. INFO: normal milestones (job started, rows loaded). WARNING: recoverable issues (retries, deprecated API). ERROR: operation failed but process continues. CRITICAL: fatal—shutdown likely. Configure level per environment; production typically INFO or WARNING.',
          tags: ['logging', 'observability'],
          frequency: 'Very High',
        },
        {
          title: 'Logger hierarchy',
          difficulty: 'Medium',
          question: 'Why use logging.getLogger(__name__) instead of print or root logger?',
          answer:
            'Named loggers form a hierarchy—configure handlers/formatters once on root or package logger. __name__ ties logs to module for filtering. print lacks levels, timestamps, and centralized control. Never call basicConfig in libraries.',
          example: 'import logging\nlogger = logging.getLogger(__name__)\nlogger.info("Loaded %s rows", count)',
          tags: ['logging', 'best-practices'],
          frequency: 'High',
        },
        {
          title: 'Structured logging',
          difficulty: 'Medium',
          question: 'How do you add structured context (job_id, batch) to logs?',
          answer:
            'Use LoggerAdapter with extra dict, contextvars (3.7+) for async/thread context, or structured libraries (structlog, python-json-logger). JSON logs integrate with ELK, Datadog, CloudWatch. Include correlation IDs across pipeline stages.',
          tags: ['logging', 'structured'],
          frequency: 'High',
        },
        {
          title: 'Handlers and rotation',
          difficulty: 'Medium',
          question: 'How do you log to both console and rotating files?',
          answer:
            'Attach multiple handlers to a logger: StreamHandler for stdout, RotatingFileHandler or TimedRotatingFileHandler for disk. Set formatter on each handler. Avoid duplicate handlers on repeated initialization in notebooks/scripts.',
          tags: ['logging', 'handlers'],
          frequency: 'Medium',
        },
      ] satisfies QuestionInput[],
    },
    {
      sheet: 'python-apis',
      category: 'APIs',
      items: [
        {
          title: 'requests session and retries',
          difficulty: 'Medium',
          question: 'How do you call REST APIs reliably with retries and connection pooling?',
          answer:
            'Use requests.Session for connection reuse and default headers. Add urllib3 Retry via HTTPAdapter for exponential backoff on 429/5xx. Set timeouts (connect, read) always—never unbounded waits. For production, consider httpx or aiohttp for async.',
          example: 'session = requests.Session()\nsession.headers.update({"Authorization": f"Bearer {token}"})\nresp = session.get(url, timeout=(5, 30))\nresp.raise_for_status()',
          tags: ['apis', 'requests'],
          frequency: 'Very High',
        },
        {
          title: 'Pagination patterns',
          difficulty: 'Medium',
          question: 'How do you fetch all pages from a paginated API?',
          answer:
            'Loop on offset/limit, cursor/next_link, or page numbers until empty. Respect rate limits (Retry-After header, sleep). Yield records as generator to avoid memory spikes. Handle partial failures with checkpointing.',
          tags: ['apis', 'pagination'],
          frequency: 'High',
        },
        {
          title: 'Rate limiting',
          difficulty: 'Medium',
          question: 'How do you respect API rate limits in a Python ingestion job?',
          answer:
            'Track request timestamps in a sliding window or token bucket. Sleep when limit approached. Honor 429 responses with Retry-After. Distribute across API keys only if ToS allows. asyncio.Semaphore or ratelimit library for cleaner throttling.',
          tags: ['apis', 'rate-limit'],
          frequency: 'High',
        },
        {
          title: 'JSON parsing at scale',
          difficulty: 'Medium',
          question: 'How do you safely parse large or untrusted JSON API responses?',
          answer:
            'Validate schema with pydantic or jsonschema before use. Stream with ijson for huge payloads. Default missing keys with .get(). Log and quarantine malformed records rather than failing entire batch. Beware float precision for IDs—keep as strings.',
          tags: ['apis', 'json'],
          frequency: 'Medium',
        },
      ] satisfies QuestionInput[],
    },
    {
      sheet: 'python-coding',
      category: 'Coding Questions',
      items: [
        {
          title: 'Flatten nested list',
          difficulty: 'Medium',
          question: 'Write a function to flatten a arbitrarily nested list [1, [2, [3, 4], 5]].',
          answer:
            'Recursive generator or iterative stack-based approach. isinstance(x, list) distinguishes nested lists. Generator avoids deep recursion limits on very nested input.',
          example: 'def flatten(items):\n    for x in items:\n        if isinstance(x, list):\n            yield from flatten(x)\n        else:\n            yield x',
          tags: ['coding', 'recursion'],
          frequency: 'Very High',
        },
        {
          title: 'Group by key',
          difficulty: 'Medium',
          question: 'Group a list of dicts by a key without pandas.',
          answer:
            'Use defaultdict(list) or dict.setdefault. Sort before itertools.groupby if consecutive grouping needed. Counter for counts only.',
          example: 'from collections import defaultdict\ndef group_by(rows, key):\n    out = defaultdict(list)\n    for row in rows:\n        out[row[key]].append(row)\n    return dict(out)',
          tags: ['coding', 'collections'],
          frequency: 'Very High',
        },
        {
          title: 'Two-sum variant',
          difficulty: 'Medium',
          question: 'Given a list of integers and a target, return indices of two numbers that add to target.',
          answer:
            'Single pass with hash map storing value→index. O(n) time, O(n) space. Check if complement exists before inserting current element to avoid using same index twice.',
          example: 'def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i',
          tags: ['coding', 'hash-map'],
          frequency: 'High',
        },
        {
          title: 'Merge sorted iterators',
          difficulty: 'Hard',
          question: 'Merge two sorted lists into one sorted list in O(n+m) time.',
          answer:
            'Two-pointer merge like merge step in mergesort. Extend to k lists with heapq.merge or heap of (value, list_index, element_index).',
          example: 'def merge(a, b):\n    i = j = 0\n    out = []\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            out.append(a[i]); i += 1\n        else:\n            out.append(b[j]); j += 1\n    out.extend(a[i:]); out.extend(b[j:])\n    return out',
          tags: ['coding', 'two-pointer'],
          frequency: 'High',
        },
      ] satisfies QuestionInput[],
    },
    {
      sheet: 'python-scenarios',
      category: 'Scenario Questions',
      items: [
        {
          title: 'Idempotent file ingestion',
          difficulty: 'Medium',
          question: 'Design a Python script that ingests daily CSV drops idempotently.',
          answer:
            'Track processed files by hash or filename+size in a manifest table. Use atomic writes (temp file then rename). Partition by ingest date. On rerun, skip or overwrite same partition deterministically. Log row counts and checksums; fail if schema drifts.',
          tags: ['scenarios', 'etl'],
          frequency: 'Very High',
        },
        {
          title: 'Memory-safe JSONL transform',
          difficulty: 'Medium',
          question: 'You must filter 20M JSON lines—how do you structure the Python job?',
          answer:
            'Stream line-by-line, json.loads per line, yield transformed dicts, write JSONL output. Optional multiprocessing per chunk if CPU-bound parse/transform. Monitor memory with tracemalloc. Avoid loading full file or building giant lists.',
          tags: ['scenarios', 'performance'],
          frequency: 'High',
        },
        {
          title: 'Config for dev vs prod',
          difficulty: 'Easy',
          question: 'How do you manage configuration across environments in Python ETL?',
          answer:
            'Use environment variables (os.environ, pydantic-settings, python-dotenv for local only). Never commit secrets. Separate config objects per env with validation at startup. Twelve-factor app pattern: config in env, not code.',
          tags: ['scenarios', 'config'],
          frequency: 'High',
        },
      ] satisfies QuestionInput[],
    },
  ],
  1600,
)
