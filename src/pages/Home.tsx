import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Hero />

        {/* Features Overview */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <div className="text-center mb-12">
                <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                  Streamline Your Payroll Process
                </h2>
                <p className="text-lg text-muted-foreground">
                  BatchPay makes it easy to send multiple payments on Base blockchain with just a few clicks
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                <div className="card-base text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">CSV Upload</h3>
                  <p className="text-muted-foreground">
                    Upload your payroll data via CSV file for quick batch processing
                  </p>
                </div>

                <div className="card-base text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Manual Entry</h3>
                  <p className="text-muted-foreground">
                    Add recipients manually with our intuitive interface
                  </p>
                </div>

                <div className="card-base text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Secure & Fast</h3>
                  <p className="text-muted-foreground">
                    Execute multiple transactions in one go with Base's fast finality
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;