import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Shield, Zap, Users, Code, Github, ExternalLink, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="py-8 bg-muted/30">
          <div className="container">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-foreground">About</span>
            </div>
          </div>
        </section>

        {/* Header */}
        <section className="py-12">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                About BatchPay
              </h1>
              <p className="text-lg text-muted-foreground">
                Revolutionizing payroll and batch payments on Base blockchain
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                BatchPay simplifies the process of sending multiple payments on the Base blockchain.
                Whether you're running payroll for your company, distributing funds to multiple recipients,
                or managing complex payment workflows, BatchPay makes it efficient, secure, and cost-effective.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-12 text-center text-2xl font-bold text-foreground md:text-3xl">
                Why Choose BatchPay?
              </h2>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="card-base text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Lightning Fast</h3>
                  <p className="text-muted-foreground">
                    Leverage Base's fast finality for near-instant payment confirmations
                  </p>
                </div>

                <div className="card-base text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Secure & Transparent</h3>
                  <p className="text-muted-foreground">
                    All transactions are recorded on-chain with full transparency and auditability
                  </p>
                </div>

                <div className="card-base text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Batch Efficiency</h3>
                  <p className="text-muted-foreground">
                    Send to hundreds of recipients in a single transaction, saving time and gas
                  </p>
                </div>

                <div className="card-base text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Low Fees</h3>
                  <p className="text-muted-foreground">
                    Only 0.5% protocol fee plus Base network costs - no hidden charges
                  </p>
                </div>

                <div className="card-base text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Code className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Developer Friendly</h3>
                  <p className="text-muted-foreground">
                    Clean API and comprehensive documentation for easy integration
                  </p>
                </div>

                <div className="card-base text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Github className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Open Source</h3>
                  <p className="text-muted-foreground">
                    Fully open source codebase - contribute and help improve the platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-12 text-center text-2xl font-bold text-foreground md:text-3xl">
                How It Works
              </h2>

              <div className="grid gap-8 md:grid-cols-3">
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                      1
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Prepare Your Data</h3>
                  <p className="text-muted-foreground">
                    Upload a CSV file with recipient addresses, names, and amounts, or add them manually
                  </p>
                </div>

                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                      2
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Review & Confirm</h3>
                  <p className="text-muted-foreground">
                    Preview all payments, check totals, and ensure everything looks correct
                  </p>
                </div>

                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                      3
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Execute Payment</h3>
                  <p className="text-muted-foreground">
                    Connect your wallet, switch to Base network, and execute the batch payment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground mb-8">
                Create your first batch payment and experience the future of efficient payroll processing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/create" className="btn-primary">
                  Create Payment
                </Link>
                <a
                  href="https://github.com/your-repo/batchpay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  View on GitHub
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;